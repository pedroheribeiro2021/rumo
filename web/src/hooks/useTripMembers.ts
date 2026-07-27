import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { TripMember, TripMemberInsert } from '../lib/types'

export function useTripMembers(tripId: string | undefined) {
  return useQuery({
    queryKey: ['trip-members', tripId],
    enabled: !!tripId,
    queryFn: async (): Promise<TripMember[]> => {
      const { data, error } = await supabase
        .from('rumo_trip_members')
        .select('*')
        .eq('trip_id', tripId!)
        .order('role', { ascending: false })

      if (error) throw error
      return data
    },
  })
}

export function useAddTripMember(tripId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: Omit<TripMemberInsert, 'trip_id'>) => {
      const { data, error } = await supabase
        .from('rumo_trip_members')
        .insert({ ...input, trip_id: tripId })
        .select('*')
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trip-members', tripId] })
    },
  })
}

export function useRemoveTripMember(tripId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (memberId: string) => {
      const { error } = await supabase.from('rumo_trip_members').delete().eq('id', memberId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trip-members', tripId] })
    },
  })
}
