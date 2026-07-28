import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Button, Input } from '../components/ui'

type Mode = 'signin' | 'signup'

function translateError(message: string) {
  if (message.includes('Invalid login credentials')) return 'E-mail ou senha incorretos.'
  if (message.includes('Email not confirmed')) return 'Confirme seu e-mail antes de entrar — veja sua caixa de entrada.'
  if (message.includes('User already registered')) return 'Esse e-mail já tem conta. Tente entrar em vez de criar uma nova.'
  if (message.includes('Password should be at least')) return 'A senha precisa ter pelo menos 6 caracteres.'
  return message
}

export function LoginPage() {
  const { session, loading } = useAuth()
  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'busy' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [signupSent, setSignupSent] = useState(false)

  if (!loading && session) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('busy')
    setErrorMsg('')

    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setStatus('error')
        setErrorMsg(translateError(error.message))
        return
      }
      if (data.session) {
        // confirmação de e-mail desativada no projeto — já entra direto
        return
      }
      setStatus('idle')
      setSignupSent(true)
      return
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setStatus('error')
      setErrorMsg(translateError(error.message))
      return
    }
  }

  function switchMode(next: Mode) {
    setMode(next)
    setStatus('idle')
    setErrorMsg('')
    setSignupSent(false)
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
          {mode === 'signin' ? 'Entre com seu e-mail e senha.' : 'Crie sua conta com e-mail e senha.'}
        </p>

        {signupSent ? (
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
            Conta criada para <strong>{email}</strong>. Se pedir confirmação, confira seu e-mail — senão, já pode{' '}
            <button
              type="button"
              onClick={() => switchMode('signin')}
              style={{ border: 'none', background: 'none', padding: 0, color: 'var(--color-success-strong)', textDecoration: 'underline', cursor: 'pointer', fontWeight: 700 }}
            >
              entrar
            </button>
            .
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
            <Input
              type="password"
              required
              minLength={6}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" fullWidth size="lg" loading={status === 'busy'}>
              {mode === 'signin' ? 'Entrar' : 'Criar conta'}
            </Button>
            {status === 'error' && <p style={{ margin: 0, fontSize: 'var(--text-body-sm)', color: 'var(--color-error)' }}>{errorMsg}</p>}
            {mode === 'signin' && (
              <Link to="/esqueci-senha" style={{ textAlign: 'center', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>
                Esqueci minha senha
              </Link>
            )}
          </form>
        )}

        {!signupSent && (
          <p style={{ marginTop: 16, textAlign: 'center', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)' }}>
            {mode === 'signin' ? (
              <>
                Ainda não tem conta?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  style={{ border: 'none', background: 'none', padding: 0, color: 'var(--color-brand)', fontWeight: 700, cursor: 'pointer' }}
                >
                  Criar conta
                </button>
              </>
            ) : (
              <>
                Já tem conta?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signin')}
                  style={{ border: 'none', background: 'none', padding: 0, color: 'var(--color-brand)', fontWeight: 700, cursor: 'pointer' }}
                >
                  Entrar
                </button>
              </>
            )}
          </p>
        )}
      </div>
    </div>
  )
}
