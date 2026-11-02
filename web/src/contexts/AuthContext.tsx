import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { AUTH_STORAGE_KEY, supabase } from '../lib/supabase'
import { parseStoredSession } from '../lib/offlineSession'
import { clearOfflineCache } from '../lib/queryClient'

interface AuthContextValue {
  session: Session | null
  loading: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  // Começa já com a sessão salva: offline o supabase-js passa ~25s tentando renovar o
  // token (backoff) antes do INITIAL_SESSION, e o app ficaria preso no "Carregando…".
  // Exceção: com `?code=` na URL a sessão válida é a que vai sair da troca PKCE (ver abaixo).
  const [initialStored] = useState(() =>
    new URLSearchParams(window.location.search).has('code')
      ? null
      : parseStoredSession(localStorage.getItem(AUTH_STORAGE_KEY)),
  )
  const [session, setSession] = useState<Session | null>(initialStored)
  const [loading, setLoading] = useState(!initialStored)

  useEffect(() => {
    // Não usar getSession() aqui: quando o link de e-mail chega com `?code=` (fluxo PKCE),
    // a troca por sessão acontece dentro da inicialização do client e só é refletida no
    // primeiro evento de onAuthStateChange. Resolver `loading` antes disso faz o RequireAuth
    // redirecionar para /login e descartar o `?code` antes da troca terminar.
    const { data: subscription } = supabase.auth.onAuthStateChange((event, newSession) => {
      // o cache offline guarda dados da conta: não pode sobrar para quem logar depois
      if (event === 'SIGNED_OUT') clearOfflineCache()
      // Sem rede e com o token vencido, o INITIAL_SESSION chega nulo mas a sessão segue
      // salva (ver offlineSession.ts). Usa ela para não mandar para o login e esconder
      // os dados em cache; quando a rede volta, o auto-refresh emite TOKEN_REFRESHED.
      if (event === 'INITIAL_SESSION' && !newSession) {
        newSession = parseStoredSession(localStorage.getItem(AUTH_STORAGE_KEY))
      }
      setSession(newSession)
      setLoading(false)
    })

    return () => subscription.subscription.unsubscribe()
  }, [])

  return <AuthContext.Provider value={{ session, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth precisa estar dentro de <AuthProvider>')
  return ctx
}
