import React from 'react';
import groupBy from 'lodash/groupBy';

import ThemedSelect from '../../misc/ThemedSelect';
import {ToolBoxNodeVariables} from '../../../atoms';
import {ToolBoxActions} from '../../../hooks';
import {SerializedGraphModelAttributes} from '../../../../lib/straighten';
import {collectOptionByType} from './utils';

function pickColorOptions(defaultOption, modelByStatus) {
  const optgroups = [];

  optgroups.push({
    label: 'Defaults',
    options: [
      {
        value: defaultOption,
        label: 'Default color'
      }
    ]
  });

  const ownOptions = collectOptionByType(modelByStatus.own, [
    'category',
    'boolean'
  ]);

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

function pickSizeOptions(defaultOption, modelByStatus) {
  const optgroups = [];

  optgroups.push({
    label: 'Defaults',
    options: [
      {
        value: defaultOption,
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
  model: SerializedGraphModelAttributes;
  variables: ToolBoxNodeVariables;
  defaultNodeColor: string | null;
  defaultNodeSize: string | null;
  actions: ToolBoxActions;
};

export default function NodeVariables({
  model,
  variables,
  actions,
  defaultNodeColor,
  defaultNodeSize
}: NodeVariablesProps) {
  const modelByStatus = groupBy(model, 'kind');

  const colorOptions = pickColorOptions(defaultNodeColor, modelByStatus);
  const sizeOptions = pickSizeOptions(defaultNodeSize, modelByStatus);

  return (
    <div className="variables-block">
      <h6 className="title is-6 block-title">Nodes</h6>
      <div className="columns">
        <div className="column is-4">color</div>
        <div className="column is-8">
          <ThemedSelect
            options={colorOptions}
            value={variables.color}
            isDisabled={colorOptions.length < 2}
            onChange={option => actions.setNodeColor(option.value)}
          />
        </div>
      </div>
      <div className="columns">
        <div className="column is-4">size</div>
        <div className="column is-8">
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
