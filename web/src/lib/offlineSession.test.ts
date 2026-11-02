import { describe, expect, it } from 'vitest'
import { parseStoredSession } from './offlineSession'

const session = {
  access_token: 'a',
  refresh_token: 'r',
  expires_at: 1,
  user: { id: 'u1' },
}

describe('parseStoredSession', () => {
  it('devolve a sessão salva mesmo com o token vencido', () => {
    expect(parseStoredSession(JSON.stringify(session))?.user.id).toBe('u1')
  })

  it('ignora storage vazio, JSON inválido ou sessão incompleta', () => {
    expect(parseStoredSession(null)).toBeNull()
    expect(parseStoredSession('{quebrado')).toBeNull()
    expect(parseStoredSession(JSON.stringify({ ...session, refresh_token: undefined }))).toBeNull()
    expect(parseStoredSession(JSON.stringify({ ...session, user: null }))).toBeNull()
  })
})

// Garante a premissa do fallback contra o supabase-js real (vale reler se ele for atualizado).
describe('supabase-js offline com token vencido', () => {
  it('avisa INITIAL_SESSION nulo mas mantém a sessão no storage', async () => {
    const { createClient } = await import('@supabase/supabase-js')
    const key = 'sb-teste-auth-token'
    const store = new Map<string, string>()
    const expired = { ...session, token_type: 'bearer', expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) - 7200 }
    store.set(key, JSON.stringify(expired))

    const client = createClient('https://teste.supabase.co', 'anon', {
      auth: {
        storageKey: key,
        storage: {
          getItem: (k) => store.get(k) ?? null,
          setItem: (k, v) => void store.set(k, v),
          removeItem: (k) => void store.delete(k),
        },
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
      global: { fetch: () => Promise.reject(new TypeError('Failed to fetch')) },
    })

    const initial = await new Promise((resolve) => {
      client.auth.onAuthStateChange((event, s) => {
        if (event === 'INITIAL_SESSION') resolve(s)
      })
    })
    client.auth.stopAutoRefresh()

    expect(initial).toBeNull()
    expect(parseStoredSession(store.get(key) ?? null)?.user.id).toBe('u1')
  }, 40_000) // o refresh faz backoff por até ~25s antes de desistir
})
