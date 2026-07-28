import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Button, Input } from '../components/ui'

type Step = 'email' | 'code' | 'newPassword' | 'done'

function translateError(message: string) {
  if (message.includes('Token has expired') || message.includes('invalid') || message.includes('expired'))
    return 'Código inválido ou expirado. Peça um novo.'
  if (message.includes('Password should be at least')) return 'A senha precisa ter pelo menos 6 caracteres.'
  return message
}

export function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'busy' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault()
    setStatus('busy')
    setErrorMsg('')
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) {
      setStatus('error')
      setErrorMsg(translateError(error.message))
      return
    }
    setStatus('idle')
    setStep('code')
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault()
    setStatus('busy')
    setErrorMsg('')
    const { error } = await supabase.auth.verifyOtp({ email, token: code, type: 'recovery' })
    if (error) {
      setStatus('error')
      setErrorMsg(translateError(error.message))
      return
    }
    setStatus('idle')
    setStep('newPassword')
  }

  async function handleSetNewPassword(e: React.FormEvent) {
    e.preventDefault()
    setStatus('busy')
    setErrorMsg('')
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) {
      setStatus('error')
      setErrorMsg(translateError(error.message))
      return
    }
    setStatus('idle')
    setStep('done')
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

        {step === 'email' && (
          <>
            <p style={{ marginTop: 6, color: 'var(--color-text-secondary)', fontSize: 'var(--text-body)' }}>
              Digite seu e-mail — vamos te mandar um código de 6 dígitos.
            </p>
            <form onSubmit={handleSendCode} style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Input type="email" required autoFocus placeholder="voce@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Button type="submit" fullWidth size="lg" loading={status === 'busy'}>
                Enviar código
              </Button>
              {status === 'error' && <p style={{ margin: 0, fontSize: 'var(--text-body-sm)', color: 'var(--color-error)' }}>{errorMsg}</p>}
            </form>
          </>
        )}

        {step === 'code' && (
          <>
            <p style={{ marginTop: 6, color: 'var(--color-text-secondary)', fontSize: 'var(--text-body)' }}>
              Digite o código de 6 dígitos enviado para <strong>{email}</strong>.
            </p>
            <form onSubmit={handleVerifyCode} style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Input
                type="text"
                inputMode="numeric"
                required
                autoFocus
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              />
              <Button type="submit" fullWidth size="lg" loading={status === 'busy'}>
                Confirmar código
              </Button>
              {status === 'error' && <p style={{ margin: 0, fontSize: 'var(--text-body-sm)', color: 'var(--color-error)' }}>{errorMsg}</p>}
              <button
                type="button"
                onClick={() => setStep('email')}
                style={{ border: 'none', background: 'none', padding: 0, color: 'var(--color-text-tertiary)', fontSize: 'var(--text-body-sm)', cursor: 'pointer' }}
              >
                Usar outro e-mail
              </button>
            </form>
          </>
        )}

        {step === 'newPassword' && (
          <>
            <p style={{ marginTop: 6, color: 'var(--color-text-secondary)', fontSize: 'var(--text-body)' }}>Escolha sua nova senha.</p>
            <form onSubmit={handleSetNewPassword} style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Input
                type="password"
                required
                autoFocus
                minLength={6}
                placeholder="Nova senha"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Button type="submit" fullWidth size="lg" loading={status === 'busy'}>
                Salvar nova senha
              </Button>
              {status === 'error' && <p style={{ margin: 0, fontSize: 'var(--text-body-sm)', color: 'var(--color-error)' }}>{errorMsg}</p>}
            </form>
          </>
        )}

        {step === 'done' && (
          <>
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
              Senha alterada com sucesso.
            </div>
            <Link to="/" style={{ display: 'block', marginTop: 16 }}>
              <Button fullWidth size="lg">
                Ir pro Rumo
              </Button>
            </Link>
          </>
        )}

        {step !== 'done' && (
          <p style={{ marginTop: 16, textAlign: 'center', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)' }}>
            <Link to="/login" style={{ color: 'var(--color-brand)', fontWeight: 700 }}>
              Voltar pro login
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}
