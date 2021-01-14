import {COMPUTED_METRICS_LABELS} from '../../../specs';

export function collectOptionByType(list, type) {
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
