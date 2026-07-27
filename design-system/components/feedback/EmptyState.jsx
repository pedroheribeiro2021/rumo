import React from 'react';

/** Empty state — no trips/expenses yet. Icon + message + optional CTA. */
export function EmptyState({ icon = '🧭', title, message, action }) {
  return (
    <div style={{ textAlign: 'center', padding: '48px 24px', fontFamily: 'var(--font-sans)' }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
      {title && <p style={{ margin: 0, fontSize: 'var(--text-h3)', fontWeight: 'var(--weight-semibold)', color: 'var(--color-text-primary)' }}>{title}</p>}
      {message && <p style={{ margin: '6px 0 0', fontSize: 'var(--text-body)', color: 'var(--color-text-secondary)' }}>{message}</p>}
      {action && <div style={{ marginTop: 18 }}>{action}</div>}
    </div>
  );
}
