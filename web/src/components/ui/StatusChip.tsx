import type { ReactNode } from 'react'

export interface StatusChipProps {
  children: ReactNode
  tone?: 'good' | 'warn' | 'bad' | 'info' | 'neutral'
}

const TONES: Record<string, { fg: string; bg: string }> = {
  good: { fg: 'var(--color-success)', bg: 'var(--color-success-subtle)' },
  warn: { fg: 'var(--color-warning)', bg: 'var(--color-warning-subtle)' },
  bad: { fg: 'var(--color-error)', bg: 'var(--color-error-subtle)' },
  info: { fg: 'var(--color-info)', bg: 'var(--color-info-subtle)' },
  neutral: { fg: 'var(--color-text-secondary)', bg: 'var(--color-surface-sunken)' },
}

/** Label pequeno em pill para status — alvo de preço atingido, estado de acerto, categorias. */
export function StatusChip({ children, tone = 'neutral' }: StatusChipProps) {
  const t = TONES[tone] || TONES.neutral
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: 22,
        padding: '0 10px',
        borderRadius: 'var(--radius-full)',
        background: t.bg,
        color: t.fg,
        fontFamily: 'var(--font-sans)',
        fontSize: 11,
        fontWeight: 'var(--weight-semibold)',
      }}
    >
      {children}
    </span>
  )
}
