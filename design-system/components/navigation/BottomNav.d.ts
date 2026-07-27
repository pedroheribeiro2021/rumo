import type { ReactNode } from 'react';

export interface BottomNavItem { value: string; label: string; icon: ReactNode; }
export interface BottomNavProps {
  items: BottomNavItem[];
  value: string;
  onChange: (value: string) => void;
}

export function BottomNav(props: BottomNavProps): JSX.Element;
