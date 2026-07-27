import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { ItineraryDay } from '../lib/types'

export function useItineraryDays(tripId: string | undefined) {
  return useQuery({
    queryKey: ['itinerary-days', tripId],
    enabled: !!tripId,
    queryFn: async (): Promise<ItineraryDay[]> => {
      const { data, error } = await supabase
        .from('rumo_itinerary_days')
        .select('*')
        .eq('trip_id', tripId!)
        .order('day_date', { ascending: true, nullsFirst: false })
        .order('sort_order', { ascending: true })
      if (error) throw error
      return data
    },
  })
}

export function useCreateItineraryDay(tripId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: { day_date: string | null; base_city: string | null; country: string | null; notes: string | null }) => {
      const { data, error } = await supabase
        .from('rumo_itinerary_days')
        .insert({ trip_id: tripId, ...input })
        .select('*')
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itinerary-days', tripId] })
    },
  })
}

export function useDeleteItineraryDay(tripId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('rumo_itinerary_days').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itinerary-days', tripId] })
    },
  })
}
