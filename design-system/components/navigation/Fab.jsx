import React from 'react';

/** Floating primary action button — the fastest path to "+ Gasto", anchored bottom-right in thumb reach. */
export function Fab({ icon = '+', onClick, label, offsetBottom = 84 }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={label}
      style={{
        position: 'fixed', right: 20, bottom: offsetBottom, width: 56, height: 56, borderRadius: '50%',
        border: 'none', background: hover ? 'var(--color-brand-hover)' : 'var(--color-brand)', color: 'var(--color-text-on-primary)',
        fontSize: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-fab)',
        cursor: 'pointer', transition: 'background var(--duration-fast), transform var(--duration-fast)',
        transform: hover ? 'scale(1.04)' : 'scale(1)', zIndex: 11,
      }}
    >
      {icon}
    </button>
  );
}
