import React from 'react';

/** Persistent offline banner — Rumo works offline for launching expenses; this signals sync-pending state. */
export function OfflineBanner({ pendingCount = 0 }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'var(--color-warning-subtle)',
      color: 'var(--color-warning-strong)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-body-sm)', fontWeight: 'var(--weight-medium)',
      borderRadius: 'var(--radius-md)',
    }}>
      <span>📶</span>
      <span>Sem conexão — {pendingCount > 0 ? `${pendingCount} gasto(s) serão sincronizados quando voltar.` : 'lançamentos serão salvos localmente.'}</span>
    </div>
  );
}
