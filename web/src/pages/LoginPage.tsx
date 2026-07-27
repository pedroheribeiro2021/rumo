import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Button, Input } from '../components/ui'

export function LoginPage() {
  const { session, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  if (!loading && session) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    setErrorMsg('')

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    })

    if (error) {
      setStatus('error')
      setErrorMsg(error.message)
      return
    }

    setStatus('sent')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100svh', alignItems: 'center', justifyContent: 'center', padding: 20, background: 'var(--color-bg)' }}>
      <div
        style={{
          width: '100%',
          maxWidth: 360,
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          padding: 32,
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <h1 style={{ margin: 0, fontSize: 'var(--text-h1)', color: 'var(--color-primary-700)', fontWeight: 800 }}>Rumo</h1>
        <p style={{ marginTop: 6, color: 'var(--color-text-secondary)', fontSize: 'var(--text-body)' }}>
          Entre com seu e-mail para receber um link de acesso.
        </p>

        {status === 'sent' ? (
          <div
            style={{
              marginTop: 24,
              background: 'var(--color-success-subtle)',
              color: 'var(--color-success-strong)',
              borderRadius: 'var(--radius-md)',
              padding: 12,
              fontSize: 'var(--text-body-sm)',
            }}
          >
            Link enviado para <strong>{email}</strong>. Confira sua caixa de entrada.
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Input
              type="email"
              required
              autoFocus
              placeholder="voce@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" fullWidth size="lg" loading={status === 'sending'}>
              Enviar link mágico
            </Button>
            {status === 'error' && <p style={{ margin: 0, fontSize: 'var(--text-body-sm)', color: 'var(--color-error)' }}>{errorMsg}</p>}
          </form>
        )}
      </div>
    </div>
  )
}
