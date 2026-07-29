import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { ChecklistItem } from '../lib/types'

export function useChecklistItems(tripId: string | undefined) {
  return useQuery({
    queryKey: ['checklist-items', tripId],
    enabled: !!tripId,
    queryFn: async (): Promise<ChecklistItem[]> => {
      const { data, error } = await supabase
        .from('rumo_checklist_items')
        .select('*')
        .eq('trip_id', tripId!)
        .order('sort_order')
        .order('created_at')
      if (error) throw error
      return data
    },
  })
}

export function useCreateChecklistItem(tripId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (title: string) => {
      const { data, error } = await supabase
        .from('rumo_checklist_items')
        .insert({ trip_id: tripId, title })
        .select('*')
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklist-items', tripId] })
    },
  })
}

export function useToggleChecklistItem(tripId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, done }: { id: string; done: boolean }) => {
      const { error } = await supabase.from('rumo_checklist_items').update({ done }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklist-items', tripId] })
    },
  })
}

export function useDeleteChecklistItem(tripId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('rumo_checklist_items').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklist-items', tripId] })
    },
  })
}
