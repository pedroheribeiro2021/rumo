import React from 'react';

/** Linear progress bar — budget spent-vs-planned, price-target proximity. */
export function ProgressBar({ value, max = 100, tone = 'brand', height = 8 }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const color = tone === 'warn' ? 'var(--color-warning)' : tone === 'bad' ? 'var(--color-error)' : 'var(--color-brand)';
  return (
    <div style={{ height, borderRadius: 'var(--radius-full)', background: 'var(--color-surface-sunken)', overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 'var(--radius-full)', transition: 'width var(--duration-slow) var(--ease-standard)' }} />
    </div>
  );
}
