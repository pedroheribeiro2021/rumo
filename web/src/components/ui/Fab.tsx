import { useState } from 'react'
import type { ReactNode } from 'react'

export interface FabProps {
  icon?: ReactNode
  onClick?: () => void
  label?: string
  offsetBottom?: number
}

/** Botão de ação primária flutuante — o caminho mais rápido pra "+ Gasto", fixo no canto inferior direito. */
export function Fab({ icon = '+', onClick, label, offsetBottom = 84 }: FabProps) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={label}
      style={{
        position: 'fixed',
        right: 20,
        bottom: offsetBottom,
        width: 56,
        height: 56,
        borderRadius: '50%',
        border: 'none',
        background: hover ? 'var(--color-brand-hover)' : 'var(--color-brand)',
        color: 'var(--color-text-on-primary)',
        fontSize: 26,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'var(--shadow-fab)',
        cursor: 'pointer',
        transition: 'background var(--duration-fast), transform var(--duration-fast)',
        transform: hover ? 'scale(1.04)' : 'scale(1)',
        zIndex: 11,
      }}
    >
      {icon}
    </button>
  )
}
