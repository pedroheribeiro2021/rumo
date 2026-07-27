import React from 'react';

const SIZES = {
  md: { height: 44, padX: 16, font: 'var(--text-body)', gap: 8 },
  lg: { height: 52, padX: 20, font: 'var(--text-body-lg)', gap: 8 },
};

function palette(variant) {
  switch (variant) {
    case 'secondary':
      return {
        bg: 'var(--color-surface)', bgHover: 'var(--color-brand-subtle)', bgActive: 'var(--color-brand-subtle)',
        fg: 'var(--color-brand)', border: 'var(--color-brand)',
      };
    case 'ghost':
      return {
        bg: 'transparent', bgHover: 'var(--color-brand-subtle)', bgActive: 'var(--color-brand-subtle)',
        fg: 'var(--color-brand)', border: 'transparent',
      };
    case 'danger':
      return {
        bg: 'var(--color-error)', bgHover: 'var(--color-error-strong)', bgActive: 'var(--color-error-strong)',
        fg: 'var(--color-text-on-primary)', border: 'transparent',
      };
    default:
      return {
        bg: 'var(--color-brand)', bgHover: 'var(--color-brand-hover)', bgActive: 'var(--color-brand-active)',
        fg: 'var(--color-text-on-primary)', border: 'transparent',
      };
  }
}

/** Primary/secondary/ghost/danger button sized for thumb reach. */
export function Button({
  variant = 'primary', size = 'md', fullWidth = false, disabled = false, loading = false,
  icon = null, iconPosition = 'left', children, onClick, type = 'button', style, ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const s = SIZES[size] || SIZES.md;
  const p = palette(variant);
  const isDisabled = disabled || loading;
  const bg = isDisabled ? 'var(--color-neutral-200)' : active ? p.bgActive : hover ? p.bgHover : p.bg;
  const fg = isDisabled ? 'var(--color-neutral-500)' : p.fg;

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: s.gap,
        height: s.height, padding: `0 ${s.padX}px`, width: fullWidth ? '100%' : undefined,
        borderRadius: 'var(--radius-md)', border: `1.5px solid ${isDisabled ? 'transparent' : p.border}`,
        background: bg, color: fg, fontFamily: 'var(--font-sans)', fontSize: s.font, fontWeight: 'var(--weight-semibold)',
        cursor: isDisabled ? 'not-allowed' : 'pointer', transition: 'background var(--duration-fast) var(--ease-standard), transform var(--duration-fast)',
        transform: active && !isDisabled ? 'scale(.98)' : 'scale(1)', boxShadow: variant === 'primary' && !isDisabled ? 'var(--shadow-xs)' : 'none',
        ...style,
      }}
      {...rest}
    >
      {loading ? <Spinner color={fg} /> : (icon && iconPosition === 'left' ? icon : null)}
      {loading ? 'Carregando…' : children}
      {!loading && icon && iconPosition === 'right' ? icon : null}
    </button>
  );
}

function Spinner({ color }) {
  return (
    <span style={{
      width: 16, height: 16, borderRadius: '50%', border: `2px solid ${color}33`, borderTopColor: color,
      animation: 'rumo-spin .7s linear infinite', display: 'inline-block',
    }}>
      <style>{'@keyframes rumo-spin{to{transform:rotate(360deg)}}'}</style>
    </span>
  );
}
