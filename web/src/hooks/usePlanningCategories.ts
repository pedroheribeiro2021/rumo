import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { PlanningCategory } from '../lib/types'

export function usePlanningCategories(tripId: string | undefined) {
  return useQuery({
    queryKey: ['planning-categories', tripId],
    enabled: !!tripId,
    queryFn: async (): Promise<PlanningCategory[]> => {
      const { data, error } = await supabase
        .from('rumo_planning_categories')
        .select('*')
        .eq('trip_id', tripId!)
        .order('sort_order')
        .order('name')
      if (error) throw error
      return data
    },
  })
}

export function useCreatePlanningCategory(tripId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (name: string) => {
      const { data, error } = await supabase
        .from('rumo_planning_categories')
        .insert({ trip_id: tripId, name })
        .select('*')
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planning-categories', tripId] })
    },
  })
}

export function useDeletePlanningCategory(tripId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('rumo_planning_categories').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planning-categories', tripId] })
    },
  })
}
