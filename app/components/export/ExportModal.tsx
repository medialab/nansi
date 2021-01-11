import React, {useState} from 'react';
import cls from 'classnames';
import {Button} from 'bloomer';
import {render as renderGraphToCanvas} from 'graphology-canvas';

import {exportGraph} from '../../lib/export';
import {useGraph, useCanvas} from '../../hooks';

import './ExportModal.scss';

type ExportModalProps = {
  isOpen: boolean;
  close: () => void;
};

function ExportGexfPanel({graph, save}) {
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
        <Button
          onClick={() => save(graph, {name, format: 'gexf'})}
          isColor="black">
          Download
        </Button>
      </div>
    </>
  );
}

function ExportJsonPanel({graph, save}) {
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
          onClick={() => save(graph, {name, format: 'json', minify})}
          isColor="black">
          Download
        </Button>
      </div>
    </>
  );
}

function ExportImagePanel({graph, save}) {
  const [name, setName] = useState('graph.png');
  const [size, setSize] = useState(2048);

  const ref = useCanvas(
    (canvas, ctx) => {
      if (!size) return;

      canvas.setAttribute('width', size);
      canvas.setAttribute('height', size);
      ctx.clearRect(0, 0, size, size);
      renderGraphToCanvas(graph, ctx, {width: size});
    },
    [size]
  );

  return (
    <div className="columns">
      <div className="column is-4">
        <div className="field">
          <label className="label">File name</label>
          <div className="control"></div>
          <input
            className="input"
            type="text"
            placeholder="e.g. graph.png"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div className="field">
          <label className="label">Size in pixels</label>
          <div className="control"></div>
          <input
            className="input"
            type="number"
            min={100}
            step={100}
            value={size}
            onChange={e => setSize(+e.target.value)}
          />
        </div>
        <br />
        <br />
        <div>
          <Button
            onClick={() => console.log('Not implemented!')}
            isColor="black">
            Download
          </Button>
        </div>
      </div>
      <div
        className="column is-8"
        style={{
          padding: '15px',
          textAlign: 'center'
        }}>
        <div style={{height: '450px', width: '450px', margin: '0 auto'}}>
          <canvas ref={ref} style={{width: '100%', margin: '0 auto'}} />
        </div>
      </div>
    </div>
  );
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

  const isLarge = activeTab === 'image';

  const modalContentStyle = {
    width: isLarge ? '75%' : null,
    transition: 'width 0.2s'
  };

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
          <PanelComponent graph={graph} save={exportGraph} />
        </div>
      </div>
    </div>
  );
}
