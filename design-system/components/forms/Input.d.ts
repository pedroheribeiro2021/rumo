import type { ChangeEventHandler } from 'react';

export interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  type?: string;
  error?: string;
  helper?: string;
  disabled?: boolean;
  prefix?: string;
  size?: 'md' | 'lg';
  autoFocus?: boolean;
  required?: boolean;
  inputMode?: string;
  step?: string | number;
  min?: string | number;
}

export function Input(props: InputProps): JSX.Element;
