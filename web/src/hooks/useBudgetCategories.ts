import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { BudgetCategory } from '../lib/types'

export function useBudgetCategories(tripId: string | undefined) {
  return useQuery({
    queryKey: ['budget-categories', tripId],
    enabled: !!tripId,
    queryFn: async (): Promise<BudgetCategory[]> => {
      const { data, error } = await supabase
        .from('rumo_budget_categories')
        .select('*')
        .eq('trip_id', tripId!)
        .order('sort_order')
        .order('name')
      if (error) throw error
      return data
    },
  })
}

export function useCreateBudgetCategory(tripId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (name: string) => {
      const { data, error } = await supabase
        .from('rumo_budget_categories')
        .insert({ trip_id: tripId, name })
        .select('*')
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget-categories', tripId] })
    },
  })
}

export function useDeleteBudgetCategory(tripId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('rumo_budget_categories').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget-categories', tripId] })
    },
  })
}
