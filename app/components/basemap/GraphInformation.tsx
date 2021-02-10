import React from 'react';
import comma from 'comma-number';
import density from 'graphology-metrics/density';
import Graph from 'graphology-types';
import inferType from 'graphology-utils/infer-type';

import Hint from '../misc/Hint';

import './GraphInformation.scss';

function UnderlyingInformation({hint, children, raw = false}) {
  return (
    <Hint
      hint={hint}
      size="large"
      style={
        !raw
          ? {textDecoration: 'underline dotted', cursor: 'pointer'}
          : {cursor: 'pointer'}
      }>
      {children}
    </Hint>
  );
}

type GraphInformationProps = {
  graph: Graph;
  weighted: boolean;
};

export default function GraphInformation({
  graph,
  weighted
}: GraphInformationProps) {
  const order = comma(graph.order);
  const size = comma(graph.size);
  const type = inferType(graph);
  const attr = graph.getAttributes();

  let infos = {
    multi: {label: '', hint: ''},
    type: {hint: ''}
  };

  const d = density(graph);

  if (type === 'directed') {
    infos.type.hint = 'Your graph only contains directed edges.';
  } else if (type === 'undirected') {
    infos.type.hint = 'Your graph only contains undirected edges.';
  } else {
    infos.type.hint = 'Your graph contains both directed and undirected edges.';
  }

  if (graph.multi) {
    infos.multi.label = 'Multi';
    infos.multi.hint =
      'Your graph may contains more than a single edge connecting one node to another.';
  } else {
    infos.multi.label = 'Simple';
    infos.multi.hint =
      'Your graph only accepts a single edge connecting one node to another.';
  }

  return (
    <div id="GraphInformation">
      <h5 className="title is-6">Graph information</h5>
      <p>
        <UnderlyingInformation hint={infos.multi.hint}>
          {infos.multi.label}
        </UnderlyingInformation>
        {', '}
        {weighted && (
          <>
            <UnderlyingInformation hint="Your graph's edges may have different weights.">
              weighted
            </UnderlyingInformation>
            {', '}
          </>
        )}
        <UnderlyingInformation hint={infos.type.hint}>
          {type}
        </UnderlyingInformation>{' '}
        graph
      </p>
      <p>
        <strong>{order}</strong> nodes and <strong>{size}</strong> edges
      </p>
      <p>
        <UnderlyingInformation hint="Proportion of possible edges actually existing in your graph.">
          Density
        </UnderlyingInformation>
        : ~<strong>{d.toFixed(4)}</strong>
      </p>
    </div>
  );
}
