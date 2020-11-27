import React, {CSSProperties, ReactNode} from 'react';
import cls from 'classnames';

export type HintPosition =
  | 'bottom-left'
  | 'bottom'
  | 'bottom-right'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top'
  | 'top-right';

type HintProps = {
  hint: string;
  children: ReactNode;
  size?: 'small' | 'medium' | 'large';
  position?: HintPosition;
  style?: CSSProperties;
};

export default function Hint({
  hint,
  children,
  size = 'medium',
  position = 'top',
  style
}: HintProps) {
  return (
    <span
      aria-label={hint}
      style={style}
      className={cls(`hint--${size}`, `hint--${position}`)}>
      {children}
    </span>
  );
}
