import type { ReactNode } from 'react';

export interface StatusChipProps {
  children: ReactNode;
  tone?: 'good' | 'warn' | 'bad' | 'info' | 'neutral';
}

export function StatusChip(props: StatusChipProps): JSX.Element;
