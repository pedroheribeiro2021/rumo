import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { LogisticsEntry, LogisticsEntryUpdate } from '../lib/types'

export function useLogisticsEntries(tripId: string | undefined) {
  return useQuery({
    queryKey: ['logistics-entries', tripId],
    enabled: !!tripId,
    queryFn: async (): Promise<LogisticsEntry[]> => {
      const { data, error } = await supabase
        .from('rumo_logistics_entries')
        .select('*')
        .eq('trip_id', tripId!)
        .order('entry_type')
        .order('check_in', { nullsFirst: false })
      if (error) throw error
      return data
    },
  })
}

export function useCreateLogisticsEntry(tripId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: {
      entry_type: string
      name: string
      address: string | null
      check_in: string | null
      check_out: string | null
      price: number | null
      currency: string
      link: string | null
      notes: string | null
      status: string
    }) => {
      const { data, error } = await supabase
        .from('rumo_logistics_entries')
        .insert({ trip_id: tripId, ...input })
        .select('*')
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logistics-entries', tripId] })
    },
  })
}

export function useUpdateLogisticsEntry(tripId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...changes }: LogisticsEntryUpdate & { id: string }) => {
      const { data, error } = await supabase.from('rumo_logistics_entries').update(changes).eq('id', id).select('*').single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logistics-entries', tripId] })
    },
  })
}

export function useDeleteLogisticsEntry(tripId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('rumo_logistics_entries').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logistics-entries', tripId] })
    },
  })
}
