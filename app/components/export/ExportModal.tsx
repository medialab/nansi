import React, {useState} from 'react';
import cls from 'classnames';

import {exportGraph} from '../../lib/export';
import {useGraph, useGraphVariables, useRenderer} from '../../hooks';

import ExportGexfPanel from './ExportGexfPanel';
import ExportJsonPanel from './ExportJsonPanel';
import ExportImagePanel from './ExportImagePanel';
import ExportSvgPanel from './ExportSvgPanel';
import ExportMinivanPanel from './ExportMinivanPanel';

import './ExportModal.scss';

const PANELS = {
  gexf: ExportGexfPanel,
  json: ExportJsonPanel,
  image: ExportImagePanel,
  svg: ExportSvgPanel,
  minivan: ExportMinivanPanel
};

const TABS = [
  {label: 'as a GEXF file', tab: 'gexf'},
  {label: 'as a JSON file', tab: 'json'},
  {label: 'as a SVG file', tab: 'svg'},
  {label: 'as a raster image', tab: 'image'},
  {label: 'as a minivan bundle', tab: 'minivan'}
];

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

  const rendererDimensions = renderer.getDimensions();

  const rendererSize = Math.min(
    rendererDimensions.width,
    rendererDimensions.height
  );

  return (
    <div id="ExportModal" className={cls('modal', isOpen && 'is-active')}>
      <div className="modal-background" onClick={close} />
      <div className="modal-content" style={{width: '75%'}}>
        <div className="export-modal-box">
          <h2>Export</h2>
          <div className="tabs">
            <ul>
              {TABS.map(item => {
                return (
                  <li
                    key={item.tab}
                    className={cls(activeTab === item.tab && 'is-active')}
                    onClick={setActiveTabIfDifferent.bind(null, item.tab)}>
                    <a>{item.label}</a>
                  </li>
                );
              })}
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
