import sortBy from 'lodash/sortBy';

import {
  COMPUTED_METRICS_LABELS,
  COMPUTED_METRICS_PRIORITY
} from '../../../specs';

export function collectOptionByType(list, type: string | Array<string>) {
  let options = (list || [])
    .filter(attr => {
      if (Array.isArray(type)) return type.includes(attr.type);
      return attr.type === type;
    })
    .map(attr => {
      return {
        value: attr.name,
        label: COMPUTED_METRICS_LABELS[attr.name] || attr.name
      };
    });

  options = sortBy(
    options,
    option => COMPUTED_METRICS_PRIORITY[option.value] || option.value
  );

  return options;
}

export function countNestedOptions(options) {
  return options.reduce((count, group) => {
    return count + group.options.length;
  }, 0);
}
