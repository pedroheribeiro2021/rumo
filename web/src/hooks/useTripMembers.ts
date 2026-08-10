import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
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

export function useInviteTripMember(tripId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: { email: string; displayName: string }) => {
      const { data, error } = await supabase.rpc('rumo_invite_trip_member', {
        p_trip_id: tripId,
        p_email: input.email,
        p_display_name: input.displayName,
      })
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trip-members', tripId] })
    },
  })
}

export function useUpdateTripMember(tripId: string) {
  const queryClient = useQueryClient()
  const { session } = useAuth()

  return useMutation({
    mutationFn: async (input: { id: string; displayName: string; profileId: string | null }) => {
      const { error } = await supabase.from('rumo_trip_members').update({ display_name: input.displayName }).eq('id', input.id)
      if (error) throw error

      // se for o próprio usuário se renomeando, guarda no perfil pra virar o padrão em novas viagens
      if (input.profileId && input.profileId === session?.user.id) {
        await supabase.from('rumo_profiles').update({ name: input.displayName }).eq('id', input.profileId)
      }
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
