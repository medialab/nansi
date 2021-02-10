import React from 'react';
import cx from 'classnames';
// import {Share} from 'react-twitter-widgets';

// import background from './background.png';
import githubLogo from './github.png';
import medialabLogo from './logo-medialab.svg';

import './Intro.scss';

export default function Intro() {
  return (
    <div className={cx('Intro')}>
      {/* <div className="background">
        <img src={background} />
      </div> */}
      <header className="header">
        <h1 className="title is-1 app-logo is-title">
          nansi
          <span className="tag">0.0.1</span>
        </h1>
        <h2 className="title is-4 is-subtitle">
          a lightweight network visualization tool
        </h2>
        <div className="shares">
          <a
            href="https://github.com/medialab/nansi/"
            target="blank"
            className="github-link">
            <img src={githubLogo} />
          </a>
          {/* <Share url="https://medialab.github.io/nansi" /> */}
        </div>
      </header>
      <a href="https://medialab.sciencespo.fr" target="blank">
        <img src={medialabLogo} className="medialab-logo" />
      </a>
    </div>
  );
}
