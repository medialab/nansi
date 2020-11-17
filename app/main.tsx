import React from 'react';
import {render} from 'react-dom';

function Application() {
  return <div>Hello World</div>;
}

const container = document.getElementById('app');

render(<Application />, container);
