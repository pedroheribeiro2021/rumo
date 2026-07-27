import type { ReactNode } from 'react';
export interface EmptyStateProps {
  icon?: ReactNode;
  title?: string;
  message?: string;
  action?: ReactNode;
}
export function EmptyState(props: EmptyStateProps): JSX.Element;
