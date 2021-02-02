import React from 'react';
import groupBy from 'lodash/groupBy';

import ThemedSelect from '../../misc/ThemedSelect';
import {ToolBoxEdgeVariables} from '../../../atoms';
import {ToolBoxActions} from '../../../hooks';
import {SerializedGraphModelAttributes} from '../../../../lib/straighten';
import {collectOptionByType, countNestedOptions} from './utils';

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

  if (defaultOption === null) {
    optgroups.push({
      label: 'Defaults',
      options: [
        {
          value: defaultOption,
          label: 'Default size'
        }
      ]
    });
  } else {
    optgroups.push({
      label: 'Defaults',
      options: [
        {
          value: null,
          label: 'Constant size'
        },
        {
          value: defaultOption,
          label: `Default size (${defaultOption})`
        }
      ]
    });
  }

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

type EdgeVariablesProps = {
  model: SerializedGraphModelAttributes;
  variables: ToolBoxEdgeVariables;
  defaultEdgeColor: string | null;
  defaultEdgeSize: string | null;
  actions: ToolBoxActions;
};

export default function EdgeVariables({
  model,
  variables,
  actions,
  defaultEdgeColor,
  defaultEdgeSize
}: EdgeVariablesProps) {
  const modelByStatus = groupBy(model, 'kind');

  const colorOptions = pickColorOptions(defaultEdgeColor, modelByStatus);
  const sizeOptions = pickSizeOptions(defaultEdgeSize, modelByStatus);

  return (
    <div className="variables-block">
      <h6 className="title is-6 block-title">Edges</h6>
      
      <div className="columns">
        <div className="column is-4">color</div>
        <div className="column is-8">
          <ThemedSelect
            options={colorOptions}
            value={variables.color}
            isDisabled={countNestedOptions(colorOptions) < 2}
            onChange={option => actions.setEdgeColor(option.value)}
          />
        </div>
      </div>
      <div className="columns">
        <div className="column is-4">size</div>
        <div className="column is-8">
          <ThemedSelect
            options={sizeOptions}
            value={variables.size}
            isDisabled={countNestedOptions(sizeOptions) < 2}
            onChange={option => actions.setEdgeSize(option.value)}
          />
        </div>
      </div>
    </div>
  );
}
