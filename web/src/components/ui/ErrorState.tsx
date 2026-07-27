export interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

/** Estado de erro — requisição falhou, com opção de tentar de novo. */
export function ErrorState({ message = 'Algo deu errado. Tente novamente.', onRetry }: ErrorStateProps) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 24px', fontFamily: 'var(--font-sans)' }}>
      <div style={{ fontSize: 32, marginBottom: 10 }}>⚠️</div>
      <p style={{ margin: 0, color: 'var(--color-error)', fontWeight: 'var(--weight-medium)' }}>{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            marginTop: 14,
            height: 40,
            padding: '0 18px',
            borderRadius: 'var(--radius-md)',
            border: '1.5px solid var(--color-brand)',
            background: 'none',
            color: 'var(--color-brand)',
            fontWeight: 'var(--weight-semibold)',
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
          }}
        >
          Tentar de novo
        </button>
      )}
    </div>
  )
}
