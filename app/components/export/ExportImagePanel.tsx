import React, {useState} from 'react';
import {render as renderGraphToCanvas} from 'graphology-canvas';
import {Button} from 'bloomer';

import {useCanvas} from '../../hooks';
import {createNodeReducer, createEdgeReducer} from '../../../lib/reducers';

const SIZE_TEMPLATES = [
  {size: 512, name: 'tiny'},
  {size: 1024, name: 'small'},
  {size: 2048, name: 'medium'},
  {size: 4096, name: 'large'},
  {size: 8192, name: 'gigantic'}
];

export default function ExportImagePanel({
  graph,
  variables,
  rendererSize,
  save
}) {
  const [name, setName] = useState('graph.png');
  const [size, setSize] = useState(2048);

  const ref = useCanvas(
    (canvas, ctx) => {
      if (!size) return;

      const scalingFactor = size / rendererSize;

      const nodeReducer = createNodeReducer({
        nodeColor: variables.nodeColor,
        nodeSize: variables.nodeSize,
        scalingFactor
      });

      const edgeReducer = createEdgeReducer({
        edgeSize: variables.edgeSize,
        edgeColor: variables.edgeColor,
        scalingFactor
      });

      canvas.setAttribute('width', size);
      canvas.setAttribute('height', size);
      ctx.clearRect(0, 0, size, size);
      renderGraphToCanvas(graph, ctx, {
        width: size,
        margin: size * 0.1,
        nodes: {
          reducer: (settings, node, attr) => {
            return nodeReducer(node, attr);
          }
        },
        edges: {
          reducer: (settings, edge, attr) => {
            return edgeReducer(edge, attr);
          }
        }
      });
    },
    [graph, variables, size]
  );

  return (
    <div className="columns">
      <div className="column is-4">
        <div className="field">
          <label className="label">File name</label>
          <div className="control">
            <input
              className="input"
              type="text"
              placeholder="e.g. graph.png"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Size</label>
        </div>
        <div className="field has-addons">
          {SIZE_TEMPLATES.map(t => {
            return (
              <p className="control" key={t.name}>
                <Button
                  isSize="small"
                  isColor={size === t.size ? 'black' : null}
                  onClick={() => {
                    if (size === t.size) return;

                    setSize(t.size);
                  }}>
                  {t.name}
                </Button>
              </p>
            );
          })}
        </div>
        <p>
          <em style={{fontSize: '0.8em'}}>
            Currently {size} x {size} pixels
          </em>
        </p>
        <br />
        <br />
        <div>
          <Button
            onClick={() => {
              if (!ref.current) return;

              save(graph, {name, format: 'png', canvas: ref.current});
            }}
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
