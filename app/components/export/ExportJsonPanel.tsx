import React, {useState} from 'react';
import {Button} from 'bloomer';

export default function ExportJsonPanel({graph, save}) {
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
