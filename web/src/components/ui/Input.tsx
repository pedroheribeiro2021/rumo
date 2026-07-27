import { useState } from 'react'
import type { ChangeEventHandler, CSSProperties, HTMLAttributes } from 'react'

export interface InputProps {
  label?: string
  placeholder?: string
  value?: string | number
  onChange?: ChangeEventHandler<HTMLInputElement>
  type?: string
  error?: string
  helper?: string
  disabled?: boolean
  prefix?: string
  size?: 'md' | 'lg'
  autoFocus?: boolean
  required?: boolean
  inputMode?: HTMLAttributes<HTMLInputElement>['inputMode']
  step?: string | number
  min?: string | number
  style?: CSSProperties
}

/** Campo de texto com label, helper/error e anel de foco. */
export function Input({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  error,
  helper,
  disabled,
  prefix,
  size = 'md',
  autoFocus,
  required,
  inputMode,
  step,
  min,
  style,
}: InputProps) {
  const [focused, setFocused] = useState(false)
  const height = size === 'lg' ? 52 : 44
  const borderColor = error ? 'var(--color-error)' : focused ? 'var(--color-brand)' : 'var(--color-border)'

  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--font-sans)', ...style }}>
      {label && (
        <span
          style={{ fontSize: 'var(--text-body-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--color-text-secondary)' }}
        >
          {label}
          {required && <span style={{ color: 'var(--color-error)' }}> *</span>}
        </span>
      )}
      <span style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {prefix && (
          <span
            style={{
              position: 'absolute',
              left: 12,
              color: 'var(--color-text-tertiary)',
              fontSize: 'var(--text-body-lg)',
              fontWeight: 'var(--weight-semibold)',
            }}
          >
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          required={required}
          inputMode={inputMode}
          step={step}
          min={min}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%',
            height,
            padding: `0 14px`,
            paddingLeft: prefix ? 30 : 14,
            borderRadius: 'var(--radius-md)',
            border: `1.5px solid ${borderColor}`,
            background: disabled ? 'var(--color-surface-sunken)' : 'var(--color-surface)',
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--text-body-lg)',
            outline: 'none',
            boxShadow: focused ? 'var(--focus-ring)' : 'none',
            transition: 'box-shadow var(--duration-fast)',
            fontVariantNumeric: type === 'number' ? 'tabular-nums' : undefined,
          }}
        />
      </span>
      {(error || helper) && (
        <span style={{ fontSize: 'var(--text-body-sm)', color: error ? 'var(--color-error)' : 'var(--color-text-tertiary)' }}>
          {error || helper}
        </span>
      )}
    </label>
  )
}
