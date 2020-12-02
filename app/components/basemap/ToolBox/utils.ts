const COMPUTED_METRICS_LABELS = {
  'nansi-louvain': 'Louvain communities',
  'nansi-betweenness': 'Betweenness centrality',
  'nansi-degree': 'Degree',
  'nansi-indegree': 'In degree',
  'nansi-outdegree': 'Out degree'
};

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
