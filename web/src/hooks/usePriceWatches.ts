import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { PriceWatch } from '../lib/types'

export function usePriceWatches(tripId: string | undefined) {
  return useQuery({
    queryKey: ['price-watches', tripId],
    enabled: !!tripId,
    queryFn: async (): Promise<PriceWatch[]> => {
      const { data, error } = await supabase
        .from('rumo_price_watches')
        .select('*')
        .eq('trip_id', tripId!)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
  })
}

export function usePriceWatch(watchId: string | undefined) {
  return useQuery({
    queryKey: ['price-watches', 'one', watchId],
    enabled: !!watchId,
    queryFn: async (): Promise<PriceWatch> => {
      const { data, error } = await supabase.from('rumo_price_watches').select('*').eq('id', watchId!).single()
      if (error) throw error
      return data
    },
  })
}

export function useCreatePriceWatch(tripId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: {
      origin: string
      destination: string
      depart_date: string | null
      return_date: string | null
      target_price: number | null
      currency: string
      notes: string | null
    }) => {
      const { data, error } = await supabase
        .from('rumo_price_watches')
        .insert({ trip_id: tripId, ...input })
        .select('*')
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['price-watches', tripId] })
    },
  })
}

export function useDeletePriceWatch(tripId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('rumo_price_watches').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['price-watches', tripId] })
    },
  })
}
