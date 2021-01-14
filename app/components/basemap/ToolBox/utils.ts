import {COMPUTED_METRICS_LABELS} from '../../../specs';

export function collectOptionByType(list, type: string | Array<string>) {
  return (list || [])
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
}
