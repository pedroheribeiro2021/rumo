import type { ReactNode } from 'react'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title?: ReactNode
  children: ReactNode
  footer?: ReactNode
}

/** Bottom-sheet em telas mobile, modal centralizado em telas largas. Use para formulários e confirmações. */
export function Modal({ open, onClose, title, children, footer }: ModalProps) {
  if (!open) return null
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'var(--color-overlay)' }} />
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 480,
          maxHeight: '85vh',
          overflowY: 'auto',
          background: 'var(--color-surface)',
          borderRadius: '20px 20px 0 0',
          boxShadow: 'var(--shadow-lg)',
          padding: '10px 20px 24px',
          animation: 'rumo-sheet-up var(--duration-slow) var(--ease-standard)',
        }}
      >
        <style>{'@keyframes rumo-sheet-up{from{transform:translateY(24px);opacity:.6}to{transform:translateY(0);opacity:1}}'}</style>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--color-border-strong)', margin: '4px auto 14px' }} />
        {title && (
          <h2 style={{ margin: '0 0 12px', fontSize: 'var(--text-h3)', color: 'var(--color-text-primary)', fontFamily: 'var(--font-sans)' }}>
            {title}
          </h2>
        )}
        {children}
        {footer && <div style={{ marginTop: 16 }}>{footer}</div>}
      </div>
    </div>
  )
}
