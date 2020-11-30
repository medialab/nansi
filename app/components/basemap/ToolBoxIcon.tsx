import React, {ComponentType, MouseEventHandler} from 'react';
import Hint, {HintPosition, HintSize} from '../misc/Hint';

type ToolBoxIconProps = {
  Icon: ComponentType<any>;
  hintPosition?: HintPosition;
  hintSize?: HintSize;
  hint?: string;
  onClick?: MouseEventHandler<HTMLElement>;
};

export default function ToolBoxIcon({
  Icon,
  hintPosition = 'top',
  hintSize = 'medium',
  hint = '',
  onClick
}: ToolBoxIconProps) {
  return (
    <Hint hint={hint} size={hintSize} position={hintPosition}>
      <Icon
        onClick={onClick}
        width={24}
        height={24}
        style={{cursor: 'pointer'}}
      />
    </Hint>
  );
}
