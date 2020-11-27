import React from 'react';
import comma from 'comma-number';
import density from 'graphology-metrics/density';

import Hint from '../misc/Hint';

import './GraphInformation.scss';

function UnderlyingInformation({hint, children}) {
  return (
    <Hint
      hint={hint}
      size="large"
      style={{textDecoration: 'underline dotted', cursor: 'pointer'}}>
      {children}
    </Hint>
  );
}

export default function GraphInformation({graph}) {
  const order = comma(graph.order);
  const size = comma(graph.size);
  const type = graph.type;

  let infos = {
    multi: {label: '', hint: ''},
    sparsity: {label: '', hint: ''},
    type: {hint: ''}
  };

  const d = density(graph);

  if (d > 0.1) {
    infos.sparsity.label = 'dense';
    infos.sparsity.hint =
      'A large proportion of possible edges is present in your graph.';
  } else {
    infos.sparsity.label = 'sparse';
    infos.sparsity.hint =
      'Very few of the possible edges exist in your graph. Most of graphs in social network analysis are sparse.';
  }

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
      'Your graph may contains more than a single edge connecting the same pair of nodes.';
  } else {
    infos.multi.label = 'Simple';
    infos.multi.hint =
      'Your graph only accepts a single edge connecting a same pair of nodes.';
  }

  return (
    <div id="GraphInformation">
      <p>
        <UnderlyingInformation hint={infos.multi.hint}>
          {infos.multi.label}
        </UnderlyingInformation>{' '}
        <UnderlyingInformation hint={infos.sparsity.hint}>
          {infos.sparsity.label}
        </UnderlyingInformation>{' '}
        <UnderlyingInformation hint={infos.type.hint}>
          {type}
        </UnderlyingInformation>{' '}
        graph
      </p>
      <p>
        <strong>{order}</strong> nodes and <strong>{size}</strong> edges
      </p>
      <p>
        Density: ~<strong>{d.toFixed(4)}</strong>
      </p>
    </div>
  );
}
