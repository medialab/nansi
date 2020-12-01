import React from 'react';
import {render} from 'react-dom';
import {RecoilRoot} from 'recoil';

import Application from './components/Application';

import './style.scss';

declare global {
  const NANSI_BASE_URL: string;
}

let CurrentApplication = Application;

function ApplicationWrapper() {
  return (
    <RecoilRoot>
      <CurrentApplication />
    </RecoilRoot>
  );
}

const container = document.getElementById('app');

function renderApplication() {
  render(<ApplicationWrapper />, container);
}

renderApplication();

if (module.hot) {
  module.hot.accept('./components/Application', () => {
    CurrentApplication = require('./components/Application').default;
    renderApplication();
  });
}
