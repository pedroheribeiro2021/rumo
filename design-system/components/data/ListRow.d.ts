import type { ReactNode, MouseEventHandler } from 'react';

export interface ListRowProps {
  title: ReactNode;
  subtitle?: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
  trailingSub?: ReactNode;
  onClick?: MouseEventHandler<HTMLDivElement>;
  divider?: boolean;
}

export function ListRow(props: ListRowProps): JSX.Element;
