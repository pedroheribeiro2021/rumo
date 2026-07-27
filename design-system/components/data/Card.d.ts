import type { ReactNode, MouseEventHandler, CSSProperties } from 'react';

export interface CardProps {
  children: ReactNode;
  padding?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
  style?: CSSProperties;
}

export function Card(props: CardProps): JSX.Element;
