import React from 'react';

import ThemedSelect from '../misc/ThemedSelect';

import './GraphSearch.scss';

export default function GraphSearch() {
  return (
    <div id="GraphSearch">
      <ThemedSelect
        options={[]}
        value={null}
        placeholder="Search a node..."
        theme={theme => {
          return {
            ...theme,
            spacing: {
              ...theme.spacing,
              controlHeight: 42
            }
          };
        }}
      />
    </div>
  );
}
