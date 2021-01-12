import React from 'react';

import './GraphLegend.scss';

function LegendCircle({color}) {
  return <span style={{color}}>●</span>;
}

export default function GraphLegend({attribute}) {
  if (!attribute || attribute.type !== 'category') return null;

  return (
    <div id="GraphLegend">
      <h2>{attribute.name}</h2>
      <ul>
        {attribute.top.map(([label]) => {
          return (
            <li key={label}>
              <LegendCircle color={attribute.palette[label]} /> {label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
