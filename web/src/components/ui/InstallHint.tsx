import { useEffect, useState } from 'react'
import { isStandalonePwa } from '../../lib/platform'

const DISMISS_KEY = 'rumo-install-hint-dismissed'

function isIosBrowserNotInstalled() {
  const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent)
  return isIos && !isStandalonePwa()
}

/** iOS não tem prompt de instalação automático (beforeinstallprompt) — só funciona via Compartilhar → Adicionar à Tela de Início. */
export function InstallHint() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY)) return
    setVisible(isIosBrowserNotInstalled())
  }, [])

  if (!visible) return null

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 14px',
        marginBottom: 16,
        background: 'var(--color-surface-sunken)',
        color: 'var(--color-text-secondary)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-body-sm)',
        borderRadius: 'var(--radius-md)',
      }}
    >
      <span>📲</span>
      <span style={{ flex: 1 }}>
        Instale o Rumo no seu iPhone: toque em <strong>Compartilhar</strong> e depois em{' '}
        <strong>Adicionar à Tela de Início</strong>.
      </span>
      <button
        onClick={() => {
          localStorage.setItem(DISMISS_KEY, '1')
          setVisible(false)
        }}
        aria-label="Dispensar"
        style={{
          border: 'none',
          background: 'none',
          color: 'var(--color-text-tertiary)',
          cursor: 'pointer',
          fontFamily: 'var(--font-sans)',
          fontSize: 16,
          lineHeight: 1,
          padding: 4,
        }}
      >
        ✕
      </button>
    </div>
  )
}
