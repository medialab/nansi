import React from 'react';
import groupBy from 'lodash/groupBy';

import ThemedSelect from '../../misc/ThemedSelect';
import {ToolBoxNodeVariables} from '../../../atoms';
import {ToolBoxActions} from '../../../hooks';
import {GraphModelDeclaration} from '../../../../lib/straighten';
import {collectOptionByType} from './utils';

function pickColorOptions(modelByStatus) {
  const optgroups = [];

  optgroups.push({
    label: 'Defaults',
    options: [
      {
        value: null,
        label: 'Default color'
      }
    ]
  });

  const ownOptions = collectOptionByType(modelByStatus.own, 'category');

  if (ownOptions.length > 0) {
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

function pickSizeOptions(modelByStatus) {
  const optgroups = [];

  optgroups.push({
    label: 'Defaults',
    options: [
      {
        value: null,
        label: 'Default size'
      }
    ]
  });

  const ownOptions = collectOptionByType(modelByStatus.own, 'number');

  if (ownOptions.length > 0) {
    optgroups.push({
      label: 'Numerical attributes',
      options: ownOptions
    });
  }

  const computedOptions = collectOptionByType(modelByStatus.computed, 'number');

  if (computedOptions.length > 0)
    optgroups.push({label: 'Computed metrics', options: computedOptions});

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
  const sizeOptions = pickSizeOptions(modelByStatus);

  return (
    <div className="variables-block">
      <h2>Nodes</h2>
      <div className="columns">
        <div className="column is-3">color</div>
        <div className="column is-9">
          <ThemedSelect
            options={colorOptions}
            value={variables.color}
            isDisabled={colorOptions.length < 2}
            onChange={option => actions.setNodeColor(option.value)}
          />
        </div>
      </div>
      <div className="columns">
        <div className="column is-3">size</div>
        <div className="column is-9">
          <ThemedSelect
            options={sizeOptions}
            value={variables.size}
            isDisabled={sizeOptions.length < 2}
            onChange={option => actions.setNodeSize(option.value)}
          />
        </div>
      </div>
    </div>
  );
}
