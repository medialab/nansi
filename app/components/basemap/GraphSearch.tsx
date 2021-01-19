import React, {useState, useMemo} from 'react';
import sortBy from 'lodash/sortBy';

import ThemedSelect from '../misc/ThemedSelect';

import './GraphSearch.scss';

function GraphSearchNoOptionsMessage({inputValue}) {
  if (!inputValue) return <span>Try typing...</span>;

  return <span>No results.</span>;
}

export default function GraphSearch({graph, renderer, targetAttribute}) {
  const [selectedOption, setSelectedOption] = useState(null);

  const options = useMemo(() => {
    const o = [];

    graph.forEachNode((node, attr) => {
      const label = attr[targetAttribute.name];

      if (label) {
        o.push({value: node, label});
      }
    });

    return sortBy(o, 'label');
  }, [graph, targetAttribute]);

  const onChange = option => {
    if (option === selectedOption) return;

    if (selectedOption) renderer.unhighlightNode(selectedOption.value);
    if (option) renderer.highlightNode(option.value);

    setSelectedOption(option);
  };

  return (
    <div id="GraphSearch">
      <ThemedSelect
        options={options}
        value={selectedOption}
        onChange={onChange}
        placeholder="Search a node..."
        noOptionsMessage={GraphSearchNoOptionsMessage}
        isClearable
        isSearchable
        theme={theme => {
          return {
            ...theme,
            spacing: {
              ...theme.spacing,
              controlHeight: 42
            }
          };
        }}
      />
    </div>
  );
}
