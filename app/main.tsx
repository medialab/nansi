import React from 'react';
import {render} from 'react-dom';
import {RecoilRoot} from 'recoil';

import './style.scss';

import Application from './components/Application';

function ApplicationWrapper() {
  return (
    <RecoilRoot>
      <Application />
    </RecoilRoot>
  );
}

const container = document.getElementById('app');
render(<ApplicationWrapper />, container);
