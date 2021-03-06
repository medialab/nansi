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
  useRenderer,
  useResetLayout
} from '../../../hooks';
import ToolBoxIcon from './ToolBoxIcon';
import Layout from './Layout';
import NodeVariables from './NodeVariables';
import LabelVariables from './LabelVariables';
import EdgeVariables from './EdgeVariables';

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
  const [renderer] = useRenderer();
  const [toolBoxState, toolBoxActions] = useToolBoxState();
  const resetLayout = useResetLayout();

  return (
    <div id="ToolBox" className={cls(expanded && 'expanded')}>
      <div id="ToolBoxTop">
        <header className="toolbox-header">
          <div className="main-column">
            <h1 className="app-logo">nansi</h1>
          </div>
          <div className="button-container">
            <ToolBoxIcon
              Icon={NewProjectIcon}
              hint="import a new graph"
              hintPosition="bottom"
              onClick={() => openModal('import')}
            />
          </div>
          <div className="button-container">
            <ToolBoxIcon
              Icon={ExportIcon}
              hint="export and download the graph"
              hintPosition="bottom"
              onClick={() => openModal('export')}
            />
          </div>
        </header>
      </div>
      <div id="ToolBoxInner">
        {model && (
          <>
            <Layout renderer={renderer} reset={resetLayout} />
            <NodeVariables
              model={model.nodes}
              variables={toolBoxState.variables.nodes}
              defaultNodeColor={model.defaultNodeColor}
              defaultNodeSize={model.defaultNodeSize}
              actions={toolBoxActions}
            />
            <LabelVariables
              model={model.nodes}
              variables={toolBoxState.variables.labels}
              defaultNodeLabel={model.defaultNodeLabel}
              actions={toolBoxActions}
            />
            <EdgeVariables
              model={model.edges}
              variables={toolBoxState.variables.edges}
              defaultEdgeColor={model.defaultEdgeColor}
              defaultEdgeSize={model.defaultEdgeSize}
              actions={toolBoxActions}
            />
          </>
        )}
      </div>
      {/* <div id="ToolBoxBottom" className="columns">
        <div className="column is-10" />
        <div className="column is-2">
          <ToolBoxIcon
            Icon={ExportIcon}
            hint="Export graph"
            onClick={() => openModal('export')}
          />
        </div>
      </div> */}
      <ControlButton
        Icon={expanded ? ToLeftIcon : ToRightIcon}
        onClick={() => setExpanded(!expanded)}
      />
    </div>
  );
}
