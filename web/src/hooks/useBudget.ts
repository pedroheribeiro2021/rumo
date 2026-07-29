import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { BudgetItem } from '../lib/types'

export function useBudgetItems(tripId: string | undefined) {
  return useQuery({
    queryKey: ['budget-items', tripId],
    enabled: !!tripId,
    queryFn: async (): Promise<BudgetItem[]> => {
      const { data, error } = await supabase
        .from('rumo_budget_items')
        .select('*')
        .eq('trip_id', tripId!)
        .order('day_date', { nullsFirst: false })
        .order('category')
      if (error) throw error
      return data
    },
  })
}

export function useCreateBudgetItem(tripId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: { category: string | null; day_date: string | null; planned_amount: number; currency: string }) => {
      const { data, error } = await supabase
        .from('rumo_budget_items')
        .insert({ trip_id: tripId, ...input })
        .select('*')
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget-items', tripId] })
    },
  })
}

export function useDeleteBudgetItem(tripId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('rumo_budget_items').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget-items', tripId] })
    },
  })
}
