import type { Session } from '@supabase/supabase-js'

/**
 * Lê a sessão que o supabase-js deixou salva no storage.
 *
 * Offline, com o access token vencido (dura 1h), o supabase-js não consegue renovar e
 * avisa "sem sessão" no INITIAL_SESSION — mas mantém a sessão salva, porque falha de
 * rede não é motivo para deslogar (ele só apaga quando o servidor recusa o refresh token).
 * Então: sessão ainda no storage depois de um INITIAL_SESSION nulo = estamos sem rede,
 * e dá para seguir mostrando os dados em cache com ela.
 */
export function parseStoredSession(raw: string | null): Session | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    if (
      typeof parsed?.access_token === 'string' &&
      typeof parsed?.refresh_token === 'string' &&
      typeof parsed?.user?.id === 'string'
    ) {
      return parsed as Session
    }
    return null
  } catch {
    return null
  }
}
