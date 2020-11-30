import React from 'react';
import Select from 'react-select';

const options = [{label: 'Community', value: 'louvain'}];

const themeOverride = theme => ({
  ...theme,
  borderRadius: 0,
  colors: {
    ...theme.colors,
    primary25: '#c4c4c4',
    primary: '#2d2d2d'
  }
});

export function NodeVariables() {
  return (
    <div className="variables-block">
      <h2>Nodes</h2>
      <div className="columns">
        <div className="column is-3">color</div>
        <div className="column is-9">
          <Select options={options} theme={themeOverride} />
        </div>
      </div>
    </div>
  );
}
