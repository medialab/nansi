import React, {ReactNode, CSSProperties, MouseEventHandler} from 'react';
import cls from 'classnames';

type ButtonSize = 'small' | 'normal' | 'medium' | 'large';
type ButtonColor = 'white' | 'black';

type ButtonProps = {
  color?: ButtonColor;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  children?: ReactNode;
  style?: CSSProperties;
  onClick?: MouseEventHandler;
};

export default function Button({
  color,
  size,
  loading = false,
  style,
  disabled = false,
  onClick,
  children
}: ButtonProps) {
  const className = cls(
    'button',
    color && `is-${color}`,
    size && `is-${size}`,
    loading && 'is-loading'
  );

  return (
    <button
      className={className}
      style={style}
      disabled={disabled}
      onClick={onClick}>
      {children}
    </button>
  );
}
