import React from 'react';
import Select from 'react-select';

const defaultTheme = theme => ({
  ...theme,
  borderRadius: 0,
  colors: {
    ...theme.colors,
    primary25: '#c4c4c4',
    primary: '#2d2d2d'
  }
});

function isOptionDisabled(option) {
  return !!option.disabled;
}

export default function ThemedSelect({options, value, theme = null, ...props}) {
  if (typeof value !== 'undefined') {
    options.some(opt => {
      if ('value' in opt && opt.value === value) {
        value = opt;
        return true;
      }

      if (opt.options)
        opt.options.some(subopt => {
          if (subopt.value === value) {
            value = subopt;
            return true;
          }

          return false;
        });

      return false;
    });
  }

  const themeOverride = styles => {
    styles = defaultTheme(styles);

    if (theme) styles = theme(styles);

    return styles;
  };

  return (
    <Select
      theme={themeOverride}
      isOptionDisabled={isOptionDisabled}
      menuPlacement="auto"
      menuPosition="fixed"
      options={options}
      value={value}
      {...props}
    />
  );
}
