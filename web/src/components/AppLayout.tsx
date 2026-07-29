import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { AppBottomNav } from './AppBottomNav'

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: '100svh', background: 'var(--color-bg)' }}>
      <header style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
        <div
          style={{
            margin: '0 auto',
            maxWidth: 'var(--container-max)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
          }}
        >
          <Link to="/" style={{ fontSize: 'var(--text-h3)', fontWeight: 800, color: 'var(--color-primary-700)' }}>
            Rumo
          </Link>
          <button
            onClick={() => supabase.auth.signOut()}
            style={{
              fontSize: 'var(--text-body-sm)',
              color: 'var(--color-text-tertiary)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
            }}
          >
            Sair
          </button>
        </div>
      </header>
      <main style={{ margin: '0 auto', maxWidth: 'var(--container-max)', padding: '20px 16px 100px' }}>{children}</main>
      <AppBottomNav />
    </div>
  )
}
