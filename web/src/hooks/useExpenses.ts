import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import type { Expense, ExpenseSplit } from '../lib/types'
import { splitEquallyCents } from '../lib/settlement'
import { dequeueExpense, enqueueExpense, getPendingExpenses, type PendingExpense } from '../lib/offlineQueue'

export type ExpenseWithSplits = Expense & { splits: ExpenseSplit[]; pending?: boolean }

function pendingToDisplay(p: PendingExpense): ExpenseWithSplits {
  return {
    id: p.localId,
    trip_id: p.tripId,
    spent_on: p.spentOn,
    description: p.description,
    category: p.category,
    amount: p.amount,
    currency: p.currency,
    fx_to_base: p.fxToBase,
    paid_by: p.paidBy,
    created_by: p.createdBy ?? null,
    created_at: p.queuedAt,
    splits: p.splits.map((s) => ({
      id: `${p.localId}-${s.memberId}`,
      expense_id: p.localId,
      member_id: s.memberId,
      share: Math.round(s.shareCents) / 100,
    })),
    pending: true,
  }
}

export function useExpenses(tripId: string | undefined) {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: ['expenses', tripId],
    enabled: !!tripId,
    // 'always': precisa rodar mesmo com navigator.onLine=false pra reler a fila local
    // e mostrar os pendentes — o try/catch abaixo já cobre a falha real de rede.
    networkMode: 'always',
    queryFn: async (): Promise<ExpenseWithSplits[]> => {
      const pending = getPendingExpenses(tripId!).map(pendingToDisplay)

      try {
        const { data, error } = await supabase
          .from('rumo_expenses')
          .select('*, splits:rumo_expense_splits(*)')
          .eq('trip_id', tripId!)
          .order('spent_on', { ascending: false })
          .order('created_at', { ascending: false })
        if (error) throw error
        return [...pending, ...(data as ExpenseWithSplits[])]
      } catch (err) {
        // offline ou falha de rede: mantém os gastos já sincronizados que já estavam em cache
        if (navigator.onLine && !(err instanceof TypeError)) throw err
        const cached = queryClient.getQueryData<ExpenseWithSplits[]>(['expenses', tripId!]) ?? []
        return [...pending, ...cached.filter((e) => !e.pending)]
      }
    },
  })
}

interface SplitInput {
  memberId: string
  shareCents: number
}

interface CreateExpenseInput {
  tripId: string
  description: string
  category: string | null
  amount: number // na moeda original
  currency: string
  fxToBase: number
  paidBy: string
  spentOn: string
  splits: SplitInput[]
}

async function insertExpenseOnServer(input: CreateExpenseInput, createdBy: string | undefined) {
  const { data: expense, error } = await supabase
    .from('rumo_expenses')
    .insert({
      trip_id: input.tripId,
      description: input.description || null,
      category: input.category,
      amount: input.amount,
      currency: input.currency,
      fx_to_base: input.fxToBase,
      paid_by: input.paidBy,
      spent_on: input.spentOn,
      created_by: createdBy,
    })
    .select('*')
    .single()
  if (error) throw error

  if (input.splits.length > 0) {
    const splitRows = input.splits.map((s) => ({
      expense_id: expense.id,
      member_id: s.memberId,
      share: Math.round(s.shareCents) / 100,
    }))

    const { error: splitsError } = await supabase.from('rumo_expense_splits').insert(splitRows)
    if (splitsError) {
      // compensação: sem o rateio, o gasto fica incompleto — melhor remover
      await supabase.from('rumo_expenses').delete().eq('id', expense.id)
      throw splitsError
    }
  }

  return expense
}

function isConnectivityError(err: unknown) {
  return !navigator.onLine || err instanceof TypeError
}

export function useCreateExpense(tripId: string) {
  const queryClient = useQueryClient()
  const { session } = useAuth()

  return useMutation({
    // 'always': por padrão o React Query pausa mutations enquanto navigator.onLine
    // é false e nunca chama mutationFn — aqui é o próprio mutationFn que decide
    // (rede real falhou ou navigator.onLine=false) e guarda na fila local.
    networkMode: 'always',
    mutationFn: async (input: CreateExpenseInput) => {
      try {
        return await insertExpenseOnServer(input, session?.user.id)
      } catch (err) {
        if (!isConnectivityError(err)) throw err
        // sem conexão: guarda localmente e sincroniza quando a rede voltar
        enqueueExpense({
          tripId: input.tripId,
          description: input.description,
          category: input.category,
          amount: input.amount,
          currency: input.currency,
          fxToBase: input.fxToBase,
          paidBy: input.paidBy,
          spentOn: input.spentOn,
          createdBy: session?.user.id,
          splits: input.splits,
        })
        return null
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses', tripId] })
    },
  })
}

// Reenvia gastos lançados offline assim que a conexão volta (enquanto a tela de Gastos estiver aberta).
export function useSyncPendingExpenses(tripId: string | undefined) {
  const queryClient = useQueryClient()
  const { session } = useAuth()

  useEffect(() => {
    if (!tripId) return

    async function trySync() {
      if (!navigator.onLine) return
      for (const pending of getPendingExpenses(tripId!)) {
        try {
          await insertExpenseOnServer(
            {
              tripId: pending.tripId,
              description: pending.description,
              category: pending.category,
              amount: pending.amount,
              currency: pending.currency,
              fxToBase: pending.fxToBase,
              paidBy: pending.paidBy,
              spentOn: pending.spentOn,
              splits: pending.splits,
            },
            pending.createdBy,
          )
          dequeueExpense(pending.localId)
          queryClient.invalidateQueries({ queryKey: ['expenses', tripId] })
        } catch (err) {
          if (isConnectivityError(err)) return // ainda sem rede de verdade — tenta de novo no próximo evento online
          console.error('Falha ao sincronizar gasto pendente', err)
        }
      }
    }

    trySync()
    window.addEventListener('online', trySync)
    return () => window.removeEventListener('online', trySync)
  }, [tripId, queryClient, session])
}

export function useDeleteExpense(tripId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (expenseId: string) => {
      const { error } = await supabase.from('rumo_expenses').delete().eq('id', expenseId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses', tripId] })
    },
  })
}

export function equalSplit(amountBaseCents: number, memberIds: string[]): SplitInput[] {
  const cents = splitEquallyCents(amountBaseCents, memberIds.length)
  return memberIds.map((memberId, i) => ({ memberId, shareCents: cents[i] }))
}
