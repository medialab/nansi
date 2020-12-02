import React from 'react';
import groupBy from 'lodash/groupBy';

import ThemedSelect from '../../misc/ThemedSelect';
import {ToolBoxLabelVariables} from '../../../atoms';
import {ToolBoxActions} from '../../../hooks';
import {GraphModelDeclaration} from '../../../../lib/straighten';
import {collectOptionByType} from './utils';

function pickTextOptions(modelByStatus) {
  const optgroups = [];

  optgroups.push({
    label: 'Defaults',
    options: [
      {
        value: null,
        label: 'Default label'
      }
    ]
  });

  const ownOptions = collectOptionByType(modelByStatus.own, 'key');

  if (ownOptions.length > 0) {
    optgroups.push({
      label: 'Attributes',
      options: ownOptions
    });
  }

  return optgroups;
}

type NodeVariablesProps = {
  model: GraphModelDeclaration;
  variables: ToolBoxLabelVariables;
  actions: ToolBoxActions;
};

export default function NodeVariables({
  model,
  variables,
  actions
}: NodeVariablesProps) {
  const modelByStatus = groupBy(model, 'kind');

  const textOptions = pickTextOptions(modelByStatus);

  return (
    <div className="variables-block">
      <h2>Labels</h2>
      <div className="columns">
        <div className="column is-3">text</div>
        <div className="column is-9">
          <ThemedSelect
            options={textOptions}
            value={variables.text}
            isDisabled={textOptions.length < 2}
            onChange={option => actions.setNodeLabel(option.value)}
          />
        </div>
      </div>
    </div>
  );
}
