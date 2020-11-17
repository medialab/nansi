import React from 'react';
import {render} from 'react-dom';

import './style.scss';

import Application from './components/Application';

const container = document.getElementById('app');

render(<Application />, container);
