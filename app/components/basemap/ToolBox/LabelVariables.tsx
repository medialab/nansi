import React, {useState} from 'react';
import Slider from 'rc-slider';
import groupBy from 'lodash/groupBy';
import debounce from 'lodash/debounce';

import ThemedSelect from '../../misc/ThemedSelect';
import {ToolBoxLabelVariables} from '../../../atoms';
import {ToolBoxActions} from '../../../hooks';
import {SerializedGraphModelAttributes} from '../../../../lib/straighten';
import {collectOptionByType} from './utils';

function pickTextOptions(defaultOption, modelByStatus) {
  const optgroups = [];

  optgroups.push({
    label: 'Defaults',
    options: [
      {
        value: defaultOption,
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

const SLIDER_MARKS = {
  '0.25': 'default'
};

function DebouncedSlider({defaultValue, onChange}) {
  const [value, setValue] = useState(defaultValue);

  const onSliderChange = newValue => {
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <Slider
      min={0}
      max={1}
      step={0.01}
      defaultValue={defaultValue}
      value={value}
      onChange={onSliderChange}
      marks={SLIDER_MARKS}
    />
  );
}

type LabelVariablesProps = {
  model: SerializedGraphModelAttributes;
  variables: ToolBoxLabelVariables;
  defaultNodeLabel: string | null;
  actions: ToolBoxActions;
};

export default function LabelVariables({
  model,
  variables,
  defaultNodeLabel,
  actions
}: LabelVariablesProps) {
  const modelByStatus = groupBy(model, 'kind');

  const textOptions = pickTextOptions(defaultNodeLabel, modelByStatus);

  return (
    <div className="variables-block">
      <h2>Labels</h2>
      <div className="columns">
        <div className="column is-4">text</div>
        <div className="column is-8">
          <ThemedSelect
            options={textOptions}
            value={variables.text}
            isDisabled={textOptions.length < 2}
            onChange={option => actions.setNodeLabel(option.value)}
          />
        </div>
      </div>
      <div className="columns">
        <div className="column is-4">density</div>
        <div className="column is-8">
          <DebouncedSlider
            defaultValue={variables.density}
            onChange={debounce(actions.setLabelDensity, 300)}
          />
        </div>
      </div>
    </div>
  );
}
