import React, {ComponentType, MouseEventHandler} from 'react';
import Hint, {HintPosition} from '../misc/Hint';

type ToolBoxIconProps = {
  Icon: ComponentType<any>;
  hintPosition?: HintPosition;
  hint?: string;
  onClick?: MouseEventHandler<HTMLElement>;
};

export default function ToolBoxIcon({
  Icon,
  hintPosition = 'top',
  hint = '',
  onClick
}: ToolBoxIconProps) {
  return (
    <Hint hint={hint} position={hintPosition}>
      <Icon
        onClick={onClick}
        width={24}
        height={24}
        style={{cursor: 'pointer'}}
      />
    </Hint>
  );
}
