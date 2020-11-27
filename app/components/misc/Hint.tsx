import React, {ReactChildren, CSSProperties} from 'react';
import cls from 'classnames';

type HintProps = {
  hint: string;
  children: ReactChildren;
  size?: 'small' | 'medium' | 'large';
  position?:
    | 'bottom-left'
    | 'bottom'
    | 'bottom-right'
    | 'left'
    | 'right'
    | 'top-left'
    | 'top'
    | 'top-right';
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
