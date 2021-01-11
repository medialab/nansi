import React, {useEffect, useState, useRef} from 'react';
import {Camera, WebGLRenderer} from 'sigma';
import {Button} from 'bloomer';
import PlayIcon from 'material-icons-svg/components/baseline/PlayArrow';
import PauseIcon from 'material-icons-svg/components/baseline/Pause';
import ResetIcon from 'material-icons-svg/components/baseline/SettingsBackupRestore';
import fa2Layout from 'graphology-layout-forceatlas2';
import FA2LayoutSupervisor from 'graphology-layout-forceatlas2/worker';
import NoverlapLayoutSupervisor from 'graphology-layout-noverlap/worker';

import Hint from '../../misc/Hint';

const DEFAULT_NOVERLAP_SETTINGS = {
  margin: 3,
  ratio: 1
};

function instantiateNoverlap(renderer: WebGLRenderer, onConverged: () => void) {
  // NOTE: this is useful, keep it in sigma
  const fixedCamera = new Camera();

  const inputReducer = (key, attr) => {
    let pos = renderer.normalizationFunction(attr);

    // TODO: mind the changes of camera API in the future
    pos = fixedCamera.graphToViewport(renderer, pos.x, pos.y);

    return {
      x: pos.x,
      y: pos.y,

      // NOTE: it seems we could need access to this in sigma
      size: renderer.nodeDataCache[key].size
    };
  };

  const outputReducer = (key, pos) => {
    return renderer.normalizationFunction.inverse(
      // TODO: mind the changes of camera API in the future
      fixedCamera.viewportToGraph(renderer, pos.x, pos.y)
    );
  };

  const noverlapSupervisor = new NoverlapLayoutSupervisor(renderer.graph, {
    settings: DEFAULT_NOVERLAP_SETTINGS,
    onConverged,
    inputReducer,
    outputReducer
  });

  return noverlapSupervisor;
}

function LayoutLoader({hidden = false}) {
  return (
    <p className="control">
      <Button
        style={{
          width: '30px',
          padding: '0px',
          border: 'none',
          background: 'none',
          display: hidden ? 'none' : 'block'
        }}
        isSize="small"
        isColor="white"
        isLoading></Button>
    </p>
  );
}

type LayoutProps = {
  renderer: WebGLRenderer;
  reset: () => void;
};

export default function Layout({renderer, reset}: LayoutProps) {
  const fa2Ref = useRef(null);
  const noverlapRef = useRef(null);
  const [isFA2Working, setIsFA2Working] = useState(false);
  const [isNoverlapWorking, setIsNoverlapWorking] = useState(false);

  useEffect(() => {
    if (renderer) {
      fa2Ref.current = new FA2LayoutSupervisor(renderer.graph, {
        settings: fa2Layout.inferSettings(renderer.graph)
      });
      noverlapRef.current = instantiateNoverlap(renderer, () => {
        setIsNoverlapWorking(false);
      });
    }

    return () => {
      if (fa2Ref.current) {
        fa2Ref.current.kill();
        fa2Ref.current = null;
      }

      if (noverlapRef.current) {
        noverlapRef.current.kill();
        noverlapRef.current = null;
      }
    };
  }, [renderer]);

  function toggleFA2() {
    if (!fa2Ref.current) return;

    if (!isFA2Working) {
      fa2Ref.current.start();
      setIsFA2Working(true);
    } else {
      fa2Ref.current.stop();
      setIsFA2Working(false);
    }
  }

  function toggleNoverlap() {
    if (!noverlapRef.current) return;

    if (!isNoverlapWorking) {
      noverlapRef.current.start();
      setIsNoverlapWorking(true);
    } else {
      noverlapRef.current.stop();
      setIsNoverlapWorking(false);
    }
  }

  function safeReset() {
    if (isFA2Working || isNoverlapWorking) return;

    reset();
  }

  return (
    <div className="variables-block">
      <h2>
        <div className="columns">
          <div className="column is-10" style={{paddingBottom: '0px'}}>
            Layout
          </div>
          <div
            className="column is-2"
            style={{
              paddingBottom: '0px',
              textAlign: 'right',
              cursor: 'pointer'
            }}>
            <Hint hint="Reset layout" position="left" width={20} size="custom">
              <ResetIcon
                id="layout-reset"
                width={19}
                height={19}
                onClick={safeReset}
                className={
                  isFA2Working || isNoverlapWorking ? 'inactive' : 'active'
                }
              />
            </Hint>
          </div>
        </div>
      </h2>
      <div className="columns">
        <div className="column is-4">ForceAtlas2</div>
        <div className="column is-8">
          <div className="field has-addons">
            <p className="control">
              <Button
                isSize="small"
                style={{width: '30px', padding: '0px'}}
                disabled={isNoverlapWorking}
                onClick={toggleFA2}>
                {!isFA2Working ? (
                  <PlayIcon width={20} height={20} />
                ) : (
                  <PauseIcon width={20} height={20} />
                )}
              </Button>
            </p>
            <LayoutLoader hidden={!isFA2Working} />
          </div>
        </div>
      </div>
      <div className="columns">
        <div className="column is-4">Anticollision</div>
        <div className="column is-8">
          <div className="field has-addons">
            <p className="control">
              <Button
                isSize="small"
                style={{width: '30px', padding: '0px'}}
                disabled={isFA2Working}
                onClick={toggleNoverlap}>
                {!isNoverlapWorking ? (
                  <PlayIcon width={20} height={20} />
                ) : (
                  <PauseIcon width={20} height={20} />
                )}
              </Button>
            </p>
            <LayoutLoader hidden={!isNoverlapWorking} />
          </div>
        </div>
      </div>
    </div>
  );
}
