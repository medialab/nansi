import React from 'react';
import groupBy from 'lodash/groupBy';

import ThemedSelect from '../../misc/ThemedSelect';
import {ToolBoxNodeVariables} from '../../../atoms';
import {ToolBoxActions} from '../../../hooks';
import {GraphModelDeclaration} from '../../../../lib/straighten';

const COMPUTED_METRICS_LABELS = {
  'nansi-louvain': 'Louvain communities'
};

function collectOptionByType(list, type) {
  return (list || [])
    .filter(attr => {
      return attr.type === type;
    })
    .map(attr => {
      return {
        value: attr.name,
        label: COMPUTED_METRICS_LABELS[attr.name] || attr.name
      };
    });
}

function pickColorOptions(modelByStatus) {
  const optgroups = [];

  optgroups.push({
    label: 'Defaults',
    options: [
      {
        value: null,
        label: 'Node default color'
      }
    ]
  });

  const ownOptions = collectOptionByType(modelByStatus.own, 'category');

  if (ownOptions.length > 0) {
    const delta = modelByStatus.own.length - ownOptions.length;

    if (delta > 0) {
      ownOptions.push({
        value: null,
        disabled: true,
        label: `${delta} hidden unfit attributes...`
      });
    }

    optgroups.push({
      label: 'Categorical attributes',
      options: ownOptions
    });
  }

  const computedOptions = collectOptionByType(
    modelByStatus.computed,
    'category'
  );

  if (computedOptions.length > 0)
    optgroups.push({label: 'Computed categories', options: computedOptions});

  return optgroups;
}

type NodeVariablesProps = {
  model: GraphModelDeclaration;
  variables: ToolBoxNodeVariables;
  actions: ToolBoxActions;
};

export default function NodeVariables({
  model,
  variables,
  actions
}: NodeVariablesProps) {
  const modelByStatus = groupBy(model, 'kind');

  const colorOptions = pickColorOptions(modelByStatus);

  return (
    <div className="variables-block">
      <h2>Nodes</h2>
      <div className="columns">
        <div className="column is-3">color</div>
        <div className="column is-9">
          <ThemedSelect
            options={colorOptions}
            value={variables.color}
            onChange={option => actions.setNodeColor(option.value)}
          />
        </div>
      </div>
    </div>
  );
}
