import React from 'react';
import cls from 'classnames';

import {COMPUTED_METRICS_LABELS} from '../../specs';

import './GraphLegend.scss';

function LegendCircle({color}) {
  return <span style={{color}}>●</span>;
}

export default function GraphLegend({attribute, graphHasTitle = false}) {
  if (!attribute || attribute.type !== 'category') return null;

  return (
    <div id="GraphLegend" className={cls(graphHasTitle && 'graph-has-title')}>
      <h2>{COMPUTED_METRICS_LABELS[attribute.name] || attribute.name}</h2>
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
