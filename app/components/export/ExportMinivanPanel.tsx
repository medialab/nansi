import React, {useState} from 'react';
import {Button} from 'bloomer';

export default function ExportMinivanPanel({graph, save}) {
  const [name, setName] = useState('graph.bundle.json');
  const [minify, setMinify] = useState(false);

  return (
    <>
      <div className="field">
        <label className="label">File name</label>
        <div className="control"></div>
        <input
          className="input"
          type="text"
          placeholder="e.g. graph.bundle.json"
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
          &nbsp;Minify the downloaded bundle?
        </label>
      </div>
      <br />
      <br />
      <div>
        <Button
          onClick={() => save(graph, {name, format: 'minivan', minify})}
          isColor="black">
          Download
        </Button>
      </div>
    </>
  );
}
