import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import type { Trip, TripInsert, TripUpdate } from '../lib/types'
import { EXPENSE_CATEGORIES, PLANNING_CATEGORIES } from '../lib/categories'

export function useTrips() {
  const { session } = useAuth()

  return useQuery({
    queryKey: ['trips'],
    enabled: !!session,
    queryFn: async (): Promise<Trip[]> => {
      const { data, error } = await supabase
        .from('rumo_trips')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
  })
}

export function useTrip(tripId: string | undefined) {
  return useQuery({
    queryKey: ['trips', tripId],
    enabled: !!tripId,
    queryFn: async (): Promise<Trip> => {
      const { data, error } = await supabase.from('rumo_trips').select('*').eq('id', tripId!).single()
      if (error) throw error
      return data
    },
  })
}

export function useCreateTrip() {
  const queryClient = useQueryClient()
  const { session } = useAuth()

  return useMutation({
    mutationFn: async (input: Omit<TripInsert, 'owner'>) => {
      const userId = session!.user.id

      const { data: trip, error } = await supabase
        .from('rumo_trips')
        .insert({ ...input, owner: userId })
        .select('*')
        .single()
      if (error) throw error

      const displayName = session!.user.email?.split('@')[0] ?? 'Eu'
      const { error: memberError } = await supabase.from('rumo_trip_members').insert({
        trip_id: trip.id,
        profile_id: userId,
        display_name: displayName,
        email: session!.user.email,
        role: 'owner',
      })
      if (memberError) throw memberError

      const { error: categoriesError } = await supabase
        .from('rumo_budget_categories')
        .insert(EXPENSE_CATEGORIES.map((name, i) => ({ trip_id: trip.id, name, sort_order: i })))
      if (categoriesError) throw categoriesError

      const { error: planningCategoriesError } = await supabase
        .from('rumo_planning_categories')
        .insert(PLANNING_CATEGORIES.map((name, i) => ({ trip_id: trip.id, name, sort_order: i })))
      if (planningCategoriesError) throw planningCategoriesError

      return trip
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] })
    },
  })
}

export function useUpdateTrip() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...changes }: TripUpdate & { id: string }) => {
      const { data, error } = await supabase.from('rumo_trips').update(changes).eq('id', id).select('*').single()
      if (error) throw error
      return data
    },
    onSuccess: (trip) => {
      queryClient.invalidateQueries({ queryKey: ['trips'] })
      queryClient.invalidateQueries({ queryKey: ['trips', trip.id] })
    },
  })
}

export function useUploadTripCover(tripId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (file: File) => {
      const ext = file.name.split('.').pop() ?? 'jpg'
      const path = `${tripId}/cover.${ext}`
      const { error: uploadError } = await supabase.storage.from('rumo-trip-covers').upload(path, file, { upsert: true })
      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('rumo-trip-covers').getPublicUrl(path)
      const { error } = await supabase.from('rumo_trips').update({ cover_image_url: data.publicUrl }).eq('id', tripId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] })
      queryClient.invalidateQueries({ queryKey: ['trips', tripId] })
    },
  })
}

export function useDeleteTrip() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('rumo_trips').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] })
    },
  })
}
