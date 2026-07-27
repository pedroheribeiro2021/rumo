import React from 'react';

/** Loading state — skeleton rows for slower loads. */
export function LoadingState({ rows = 3 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ height: 56, borderRadius: 'var(--radius-md)', background: 'var(--color-surface-sunken)', overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, var(--color-border), transparent)', animation: 'rumo-shimmer 1.4s infinite' }} />
        </div>
      ))}
      <style>{'@keyframes rumo-shimmer{from{transform:translateX(-100%)}to{transform:translateX(100%)}}'}</style>
    </div>
  );
}
