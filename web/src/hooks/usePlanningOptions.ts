import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { PlanningOption, PlanningOptionUpdate } from '../lib/types'

// Segmentos onde só faz sentido ter uma opção "vencedora" por cidade (não dá
// pra reservar 2 hotéis ou 2 passagens pro mesmo trecho) — promover uma
// descarta as outras candidatas da mesma cidade+segmento automaticamente.
// Demais categorias (padrão ou criadas pelo usuário) não são exclusivas:
// escolher uma não impede as outras de também virarem parte da viagem.
const EXCLUSIVE_SEGMENTS = ['hospedagem', 'transporte']

export function usePlanningOptions(tripId: string | undefined) {
  return useQuery({
    queryKey: ['planning-options', tripId],
    enabled: !!tripId,
    queryFn: async (): Promise<PlanningOption[]> => {
      const { data, error } = await supabase
        .from('rumo_planning_options')
        .select('*')
        .eq('trip_id', tripId!)
        .order('created_at', { ascending: true })
      if (error) throw error
      return data
    },
  })
}

export function useCreatePlanningOption(tripId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: {
      segment: string
      title: string
      city: string | null
      address: string | null
      price: number | null
      currency: string
      date_from: string | null
      date_to: string | null
      day_id: string | null
      link: string | null
      notes: string | null
      created_by: string | undefined
    }) => {
      const { data, error } = await supabase
        .from('rumo_planning_options')
        .insert({ trip_id: tripId, ...input })
        .select('*')
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planning-options', tripId] })
    },
  })
}

export function useUpdatePlanningOption(tripId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...changes }: PlanningOptionUpdate & { id: string }) => {
      const { data, error } = await supabase.from('rumo_planning_options').update(changes).eq('id', id).select('*').single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planning-options', tripId] })
    },
  })
}

export function useDeletePlanningOption(tripId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('rumo_planning_options').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planning-options', tripId] })
    },
  })
}

// Promove uma opção candidata a escolhida: marca status='chosen', descarta as
// concorrentes (mesma cidade+segmento) quando o segmento é exclusivo, e — se a
// opção já estiver vinculada a um dia do roteiro — escreve título/notas nesse dia.
export function usePromotePlanningOption(tripId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (option: PlanningOption) => {
      if (EXCLUSIVE_SEGMENTS.includes(option.segment) && option.city) {
        const { error: discardError } = await supabase
          .from('rumo_planning_options')
          .update({ status: 'discarded' })
          .eq('trip_id', tripId)
          .eq('segment', option.segment)
          .eq('city', option.city)
          .neq('id', option.id)
        if (discardError) throw discardError
      }

      const { error: chosenError } = await supabase.from('rumo_planning_options').update({ status: 'chosen' }).eq('id', option.id)
      if (chosenError) throw chosenError

      if (option.day_id) {
        const { error: dayError } = await supabase
          .from('rumo_itinerary_days')
          .update({ title: option.title, notes: option.notes })
          .eq('id', option.day_id)
        if (dayError) throw dayError
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planning-options', tripId] })
      queryClient.invalidateQueries({ queryKey: ['itinerary-days', tripId] })
    },
  })
}
