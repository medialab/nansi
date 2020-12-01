import React from 'react';
import Select from 'react-select';
import groupBy from 'lodash/groupBy';

const themeOverride = theme => ({
  ...theme,
  borderRadius: 0,
  colors: {
    ...theme.colors,
    primary25: '#c4c4c4',
    primary: '#2d2d2d'
  }
});

function pickColorOptions(modelByStatus) {
  const optgroups = [];

  const defaultColor = modelByStatus.wellKnown.find(attr => {
    return attr.name === 'color';
  });

  if (defaultColor)
    optgroups.push({
      label: 'Defaults',
      options: [
        {
          value: defaultColor.name,
          label: 'Node default color'
        }
      ]
    });

  const ownOptions = (modelByStatus.own || [])
    .filter(attr => {
      return attr.type === 'category';
    })
    .map(attr => {
      return {
        value: attr.name,
        label: attr.name
      };
    });

  if (ownOptions.length > 0) {
    optgroups.push({
      label: 'Categorical attributes',
      options: ownOptions
    });
  }

  return optgroups;
}

export function NodeVariables({model}) {
  const modelByStatus = groupBy(model, 'kind');

  const colorOptions = pickColorOptions(modelByStatus);

  return (
    <div className="variables-block">
      <h2>Nodes</h2>
      <div className="columns">
        <div className="column is-3">color</div>
        <div className="column is-9">
          <Select options={colorOptions} theme={themeOverride} />
        </div>
      </div>
    </div>
  );
}
