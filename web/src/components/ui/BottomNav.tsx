import type { ReactNode } from 'react'

export interface BottomNavItem {
  value: string
  label: string
  icon: ReactNode
}

export interface BottomNavProps {
  items: BottomNavItem[]
  value: string
  onChange: (value: string) => void
}

/** Barra de navegação fixa inferior — navegação principal do app. */
export function BottomNav({ items, value, onChange }: BottomNavProps) {
  return (
    <nav
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        background: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
        paddingBottom: 'var(--safe-bottom)',
        boxShadow: 'var(--shadow-lg)',
        zIndex: 10,
      }}
    >
      {items.map((it) => {
        const active = it.value === value
        const color = active ? 'var(--color-brand)' : 'var(--color-text-tertiary)'
        return (
          <button
            key={it.value}
            onClick={() => onChange(it.value)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              minHeight: 56,
              border: 'none',
              background: 'none',
              color,
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
            }}
          >
            <span style={{ fontSize: 20, lineHeight: 1 }}>{it.icon}</span>
            <span style={{ fontSize: 11, fontWeight: active ? 'var(--weight-semibold)' : 'var(--weight-medium)' }}>{it.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
