import React from 'react';
import comma from 'comma-number';

import './GraphInformation.scss';

function UnderlyingInformation({children}) {
  return (
    <span style={{textDecoration: 'underline dotted', cursor: 'pointer'}}>
      {children}
    </span>
  );
}

export default function GraphInformation({graph}) {
  const order = comma(graph.order);
  const size = comma(graph.size);

  return (
    <div id="GraphInformation">
      <p>
        Quite <UnderlyingInformation>sparse</UnderlyingInformation>{' '}
        <UnderlyingInformation>{graph.type}</UnderlyingInformation> graph
      </p>
      <p>
        <strong>{order}</strong> nodes and <strong>{size}</strong> edges
      </p>
    </div>
  );
}
