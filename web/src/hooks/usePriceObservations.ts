import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { PriceObservation } from '../lib/types'

export function usePriceObservations(watchId: string | undefined) {
  return useQuery({
    queryKey: ['price-observations', watchId],
    enabled: !!watchId,
    queryFn: async (): Promise<PriceObservation[]> => {
      const { data, error } = await supabase
        .from('rumo_price_observations')
        .select('*')
        .eq('watch_id', watchId!)
        .order('observed_at', { ascending: true })
      if (error) throw error
      return data
    },
  })
}

// Última observação de cada watch, numa única query (evita N+1 na lista de trechos).
export function useLatestObservations(watchIds: string[]) {
  return useQuery({
    queryKey: ['price-observations', 'latest', watchIds],
    enabled: watchIds.length > 0,
    queryFn: async (): Promise<Record<string, PriceObservation>> => {
      const { data, error } = await supabase
        .from('rumo_price_observations')
        .select('*')
        .in('watch_id', watchIds)
        .order('observed_at', { ascending: true })
      if (error) throw error

      const latest: Record<string, PriceObservation> = {}
      for (const obs of data) latest[obs.watch_id] = obs
      return latest
    },
  })
}

export function useAddPriceObservation(watchId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: { observed_at: string; price: number; source: string | null; note: string | null }) => {
      const { data, error } = await supabase
        .from('rumo_price_observations')
        .insert({ watch_id: watchId, ...input })
        .select('*')
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['price-observations', watchId] })
    },
  })
}

export function useDeletePriceObservation(watchId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('rumo_price_observations').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['price-observations', watchId] })
    },
  })
}
