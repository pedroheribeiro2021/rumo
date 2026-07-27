export interface ProgressBarProps {
  value: number;
  max?: number;
  tone?: 'brand' | 'warn' | 'bad';
  height?: number;
}

export function ProgressBar(props: ProgressBarProps): JSX.Element;
