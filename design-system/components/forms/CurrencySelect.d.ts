import type { ChangeEventHandler } from 'react';

export interface CurrencySelectProps {
  value: string;
  onChange: ChangeEventHandler<HTMLSelectElement>;
  currencies?: string[];
  label?: string;
  size?: 'md' | 'lg';
}

export function CurrencySelect(props: CurrencySelectProps): JSX.Element;
