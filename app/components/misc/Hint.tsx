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

export type HintSize = 'small' | 'medium' | 'large';

type HintProps = {
  hint: string;
  children: ReactNode;
  size?: HintSize;
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
