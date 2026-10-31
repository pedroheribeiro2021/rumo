import { QueryClient } from '@tanstack/react-query'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'

// Quanto tempo os dados lidos do servidor ficam guardados no aparelho para consulta offline.
// Cobre uma viagem longa sem internet; precisa ser <= gcTime, senão o React Query
// descarta a query da memória (e do armazenamento) antes disso.
export const OFFLINE_CACHE_MAX_AGE = 1000 * 60 * 60 * 24 * 30 // 30 dias

// Trocar quando o formato dos dados em cache mudar de um jeito incompatível —
// o cache antigo é descartado em vez de ser restaurado.
export const OFFLINE_CACHE_BUSTER = 'v1'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: OFFLINE_CACHE_MAX_AGE,
      retry: 1,
    },
  },
})

// Sem isso o cache vive só na memória: ao reabrir o PWA sem internet, nenhuma tela tinha dados.
export const queryPersister = createSyncStoragePersister({
  storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  key: 'rumo:query-cache',
})

/** Apaga os dados guardados (memória + aparelho) — usado no logout, para não vazar dados entre contas. */
export function clearOfflineCache() {
  queryClient.clear()
  queryPersister.removeClient()
}
