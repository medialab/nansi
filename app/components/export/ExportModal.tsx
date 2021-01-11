import React, {useState} from 'react';
import cls from 'classnames';
import {Button} from 'bloomer';

import {exportGraph} from '../../lib/export';
import {useGraph} from '../../hooks';

import './ExportModal.scss';

type ExportModalProps = {
  isOpen: boolean;
  close: () => void;
};

function ExportGexfPanel({save}) {
  const [name, setName] = useState('graph.gexf');

  return (
    <>
      <div className="field">
        <label className="label">File name</label>
        <div className="control"></div>
        <input
          className="input"
          type="text"
          placeholder="e.g. graph.gexf"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>
      <br />
      <br />
      <div>
        <Button onClick={() => save({name, format: 'gexf'})} isColor="black">
          Download
        </Button>
      </div>
    </>
  );
}

function ExportJsonPanel({save}) {
  const [name, setName] = useState('graph.json');
  const [minify, setMinify] = useState(false);

  return (
    <>
      <div className="field">
        <label className="label">File name</label>
        <div className="control"></div>
        <input
          className="input"
          type="text"
          placeholder="e.g. graph.json"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>
      <div>
        <label className="checkbox">
          <input
            type="checkbox"
            className="checkbox"
            checked={minify}
            onChange={e => setMinify(e.target.checked)}
          />
          &nbsp;Minify the downloaded JSON file?
        </label>
      </div>
      <br />
      <br />
      <div>
        <Button
          onClick={() => save({name, format: 'json', minify})}
          isColor="black">
          Download
        </Button>
      </div>
    </>
  );
}

function ExportImagePanel() {
  return <div>todo...</div>;
}

const PANELS = {
  gexf: ExportGexfPanel,
  json: ExportJsonPanel,
  image: ExportImagePanel
};

export default function ExportModal({isOpen, close}: ExportModalProps) {
  const graph = useGraph();
  const [activeTab, setActiveTab] = useState('gexf');

  const setActiveTabIfDifferent = newActiveTab => {
    if (newActiveTab === activeTab) return;

    setActiveTab(newActiveTab);
  };

  const PanelComponent = PANELS[activeTab];

  const save = exportGraph.bind(null, graph);

  return (
    <div id="ExportModal" className={cls('modal', isOpen && 'is-active')}>
      <div className="modal-background" onClick={close} />
      <div className="modal-content">
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
          <PanelComponent save={save} />
        </div>
      </div>
    </div>
  );
}
