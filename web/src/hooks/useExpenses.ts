import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import type { Expense, ExpenseSplit } from '../lib/types'
import { splitEquallyCents } from '../lib/settlement'

export type ExpenseWithSplits = Expense & { splits: ExpenseSplit[] }

export function useExpenses(tripId: string | undefined) {
  return useQuery({
    queryKey: ['expenses', tripId],
    enabled: !!tripId,
    queryFn: async (): Promise<ExpenseWithSplits[]> => {
      const { data, error } = await supabase
        .from('rumo_expenses')
        .select('*, splits:rumo_expense_splits(*)')
        .eq('trip_id', tripId!)
        .order('spent_on', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as ExpenseWithSplits[]
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

export function useCreateExpense(tripId: string) {
  const queryClient = useQueryClient()
  const { session } = useAuth()

  return useMutation({
    mutationFn: async (input: CreateExpenseInput) => {
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
          created_by: session?.user.id,
        })
        .select('*')
        .single()
      if (error) throw error

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

      return expense
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses', tripId] })
    },
  })
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
