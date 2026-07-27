export interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  ring?: boolean;
}

export function Avatar(props: AvatarProps): JSX.Element;
