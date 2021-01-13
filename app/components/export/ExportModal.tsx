import React, {useState} from 'react';
import cls from 'classnames';

import {exportGraph} from '../../lib/export';
import {useGraph, useGraphVariables, useRenderer} from '../../hooks';

import ExportGexfPanel from './ExportGexfPanel';
import ExportJsonPanel from './ExportJsonPanel';
import ExportImagePanel from './ExportImagePanel';

import './ExportModal.scss';

const PANELS = {
  gexf: ExportGexfPanel,
  json: ExportJsonPanel,
  image: ExportImagePanel
};

type ExportModalProps = {
  isOpen: boolean;
  close: () => void;
};

export default function ExportModal({isOpen, close}: ExportModalProps) {
  const graph = useGraph();
  const [renderer] = useRenderer();
  const variables = useGraphVariables();
  const [activeTab, setActiveTab] = useState('gexf');

  if (!graph || !renderer || !variables) return null;

  const setActiveTabIfDifferent = newActiveTab => {
    if (newActiveTab === activeTab) return;

    setActiveTab(newActiveTab);
  };

  const PanelComponent = PANELS[activeTab];

  const isLarge = activeTab === 'image';

  const modalContentStyle = {
    width: isLarge ? '75%' : null,
    transition: 'width 0.2s'
  };

  const rendererSize = Math.min(renderer.width, renderer.height);

  return (
    <div id="ExportModal" className={cls('modal', isOpen && 'is-active')}>
      <div className="modal-background" onClick={close} />
      <div className="modal-content" style={modalContentStyle}>
        <div className="export-modal-box">
          <h2>Export</h2>
          <div className="tabs">
            <ul>
              <li
                className={cls(activeTab === 'gexf' && 'is-active')}
                onClick={setActiveTabIfDifferent.bind(null, 'gexf')}>
                <a>as a GEXF file</a>
              </li>
            </ul>
            <ul>
              <li
                className={cls(activeTab === 'json' && 'is-active')}
                onClick={setActiveTabIfDifferent.bind(null, 'json')}>
                <a>as a JSON file</a>
              </li>
            </ul>
            <ul>
              <li
                className={cls(activeTab === 'image' && 'is-active')}
                onClick={setActiveTabIfDifferent.bind(null, 'image')}>
                <a>as a raster image</a>
              </li>
            </ul>
          </div>
          <PanelComponent
            graph={graph}
            variables={variables}
            rendererSize={rendererSize}
            save={exportGraph}
          />
        </div>
      </div>
    </div>
  );
}
