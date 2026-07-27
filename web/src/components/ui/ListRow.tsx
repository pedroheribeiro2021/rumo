import { useState } from 'react'
import type { MouseEventHandler, ReactNode } from 'react'

export interface ListRowProps {
  title: ReactNode
  subtitle?: ReactNode
  leading?: ReactNode
  trailing?: ReactNode
  trailingSub?: ReactNode
  onClick?: MouseEventHandler<HTMLDivElement>
  divider?: boolean
}

/** Linha de lista tocável — viagens, gastos, membros. Título + subtítulo à esquerda, valor/ação à direita. */
export function ListRow({ title, subtitle, leading, trailing, trailingSub, onClick, divider = true }: ListRowProps) {
  const [hover, setHover] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => onClick && setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '14px 4px',
        minHeight: 44,
        borderBottom: divider ? '1px solid var(--color-border)' : 'none',
        background: hover ? 'var(--color-surface-sunken)' : 'transparent',
        cursor: onClick ? 'pointer' : 'default',
        borderRadius: 'var(--radius-sm)',
        transition: 'background var(--duration-fast)',
      }}
    >
      {leading}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            margin: 0,
            fontSize: 'var(--text-body)',
            fontWeight: 'var(--weight-medium)',
            color: 'var(--color-text-primary)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </p>
        {subtitle && (
          <p
            style={{
              margin: '2px 0 0',
              fontSize: 'var(--text-body-sm)',
              color: 'var(--color-text-secondary)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {(trailing || trailingSub) && (
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          {trailing && (
            <p
              style={{
                margin: 0,
                fontSize: 'var(--text-money)',
                fontWeight: 'var(--weight-semibold)',
                fontVariantNumeric: 'tabular-nums',
                color: 'var(--color-text-primary)',
              }}
            >
              {trailing}
            </p>
          )}
          {trailingSub && (
            <p style={{ margin: '2px 0 0', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>
              {trailingSub}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
