import type { ReactNode } from 'react';

export interface FabProps {
  icon?: ReactNode;
  onClick?: () => void;
  label?: string;
  offsetBottom?: number;
}

export function Fab(props: FabProps): JSX.Element;
