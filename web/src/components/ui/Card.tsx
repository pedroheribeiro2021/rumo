import { useState } from 'react'
import type { CSSProperties, MouseEventHandler, ReactNode } from 'react'

export interface CardProps {
  children: ReactNode
  padding?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onClick?: MouseEventHandler<HTMLDivElement>
  style?: CSSProperties
}

/** Container de superfície para conteúdo agrupado — base de listas, formulários, resumos. */
export function Card({ children, padding = 'md', interactive = false, onClick, style }: CardProps) {
  const [hover, setHover] = useState(false)
  const pad = padding === 'sm' ? 12 : padding === 'lg' ? 24 : 16
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => interactive && setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: pad,
        boxShadow: hover ? 'var(--shadow-sm)' : 'var(--shadow-xs)',
        cursor: interactive ? 'pointer' : 'default',
        transition: 'box-shadow var(--duration-fast) var(--ease-standard), transform var(--duration-fast)',
        transform: interactive && hover ? 'translateY(-1px)' : 'none',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
