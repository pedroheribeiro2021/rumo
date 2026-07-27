import React from 'react';

/** Pill-style tab row — switches between sections (Monitor / Roteiro / Orçamento…). */
export function Tabs({ items, value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2, WebkitOverflowScrolling: 'touch' }}>
      {items.map((it) => {
        const active = it.value === value;
        return (
          <button
            key={it.value}
            onClick={() => onChange(it.value)}
            style={{
              flexShrink: 0, height: 36, padding: '0 16px', borderRadius: 'var(--radius-full)', border: 'none',
              background: active ? 'var(--color-brand)' : 'var(--color-surface)',
              color: active ? 'var(--color-text-on-primary)' : 'var(--color-text-secondary)',
              fontFamily: 'var(--font-sans)', fontSize: 'var(--text-body-sm)', fontWeight: 'var(--weight-semibold)',
              boxShadow: active ? 'none' : 'inset 0 0 0 1px var(--color-border)', cursor: 'pointer',
              transition: 'background var(--duration-fast)',
            }}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
