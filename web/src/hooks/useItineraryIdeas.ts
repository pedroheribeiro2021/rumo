import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { ItineraryIdea, ItineraryIdeaUpdate } from '../lib/types'

export function useItineraryIdeas(tripId: string | undefined) {
  return useQuery({
    queryKey: ['itinerary-ideas', tripId],
    enabled: !!tripId,
    queryFn: async (): Promise<ItineraryIdea[]> => {
      const { data, error } = await supabase
        .from('rumo_itinerary_ideas')
        .select('*')
        .eq('trip_id', tripId!)
        .order('created_at', { ascending: true })
      if (error) throw error
      return data
    },
  })
}

export function useCreateIdea(tripId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: {
      day_id: string | null
      idea_type: string
      title: string
      notes: string | null
      link: string | null
      created_by: string | undefined
    }) => {
      const { data, error } = await supabase
        .from('rumo_itinerary_ideas')
        .insert({ trip_id: tripId, ...input })
        .select('*')
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itinerary-ideas', tripId] })
    },
  })
}

export function useUpdateIdea(tripId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...changes }: ItineraryIdeaUpdate & { id: string }) => {
      const { data, error } = await supabase.from('rumo_itinerary_ideas').update(changes).eq('id', id).select('*').single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itinerary-ideas', tripId] })
    },
  })
}

export function useDeleteIdea(tripId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('rumo_itinerary_ideas').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itinerary-ideas', tripId] })
    },
  })
}

// Promove uma ideia a conteúdo confirmado do dia: marca como escolhida, escreve
// título/notas no dia do roteiro e (só pra planos de dia alternativos) descarta as irmãs.
export function usePromoteIdea(tripId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (idea: ItineraryIdea) => {
      if (!idea.day_id) throw new Error('Vincule a ideia a um dia do roteiro antes de promover.')

      if (idea.idea_type === 'day_plan') {
        const { error: discardError } = await supabase
          .from('rumo_itinerary_ideas')
          .update({ status: 'discarded' })
          .eq('day_id', idea.day_id)
          .eq('idea_type', 'day_plan')
          .neq('id', idea.id)
        if (discardError) throw discardError
      }

      const { error: chosenError } = await supabase.from('rumo_itinerary_ideas').update({ status: 'chosen' }).eq('id', idea.id)
      if (chosenError) throw chosenError

      const { error: dayError } = await supabase
        .from('rumo_itinerary_days')
        .update({ title: idea.title, notes: idea.notes })
        .eq('id', idea.day_id)
      if (dayError) throw dayError
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itinerary-ideas', tripId] })
      queryClient.invalidateQueries({ queryKey: ['itinerary-days', tripId] })
    },
  })
}
