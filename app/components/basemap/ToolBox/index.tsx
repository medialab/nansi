import React, {useState} from 'react';
import cls from 'classnames';
import ToLeftIcon from 'material-icons-svg/components/baseline/KeyboardArrowLeft';
import ToRightIcon from 'material-icons-svg/components/baseline/KeyboardArrowRight';
import NewProjectIcon from 'material-icons-svg/components/baseline/FileCopy';
import ExportIcon from 'material-icons-svg/components/baseline/SaveAlt';

import {
  useOpenModal,
  useModel,
  useToolBoxState,
  useGraph
} from '../../../hooks';
import ToolBoxIcon from './ToolBoxIcon';
import Layout from './Layout';
import NodeVariables from './NodeVariables';
import LabelVariables from './LabelVariables';

import './ToolBox.scss';

function ControlButton({Icon, onClick = null}) {
  return (
    <div className="control-button" onClick={onClick}>
      <Icon height={32} width={32} />
    </div>
  );
}

export default function ToolBox() {
  const [expanded, setExpanded] = useState(true);
  const openModal = useOpenModal();
  const model = useModel();
  const graph = useGraph();
  const [toolBoxState, toolBoxActions] = useToolBoxState();

  return (
    <div id="ToolBox" className={cls(expanded && 'expanded')}>
      <div id="ToolBoxTop" className="columns">
        <div className="column is-10">
          <h1>Nansi</h1>
        </div>
        <div className="column is-2">
          <ToolBoxIcon
            Icon={NewProjectIcon}
            hint="Create a new project"
            hintPosition="bottom"
            onClick={() => openModal('import')}
          />
        </div>
      </div>
      <div id="ToolBoxInner">
        {model && (
          <>
            <Layout graph={graph} />
            <NodeVariables
              model={model.nodes}
              variables={toolBoxState.variables.nodes}
              actions={toolBoxActions}
            />
            <LabelVariables
              model={model.nodes}
              variables={toolBoxState.variables.labels}
              actions={toolBoxActions}
            />
          </>
        )}
      </div>
      <div id="ToolBoxBottom" className="columns">
        <div className="column is-10" />
        <div className="column is-2">
          <ToolBoxIcon
            Icon={ExportIcon}
            hint="Export graph"
            onClick={() => openModal('export')}
          />
        </div>
      </div>
      <ControlButton
        Icon={expanded ? ToLeftIcon : ToRightIcon}
        onClick={() => setExpanded(!expanded)}
      />
    </div>
  );
}
