import React, {useEffect, useState, useRef} from 'react';
import {Camera, WebGLRenderer} from 'sigma';
import {Button} from 'bloomer';
import PlayIcon from 'material-icons-svg/components/baseline/PlayArrow';
import PauseIcon from 'material-icons-svg/components/baseline/Pause';
import fa2Layout from 'graphology-layout-forceatlas2';
import FA2LayoutSupervisor from 'graphology-layout-forceatlas2/worker';
import NoverlapLayoutSupervisor from 'graphology-layout-noverlap/worker';

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

type LayoutProps = {
  renderer: WebGLRenderer;
};

export default function Layout({renderer}: LayoutProps) {
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

  function startFA2() {
    if (isFA2Working || !fa2Ref.current) return;

    fa2Ref.current.start();

    setIsFA2Working(true);
  }

  function stopFA2() {
    if (!isFA2Working || !fa2Ref.current) return;

    fa2Ref.current.stop();

    setIsFA2Working(false);
  }

  function startNoverlap() {
    if (isNoverlapWorking || !noverlapRef.current) return;

    noverlapRef.current.start();

    setIsNoverlapWorking(true);
  }

  function stopNoverlap() {
    if (!isNoverlapWorking || !noverlapRef.current) return;

    noverlapRef.current.stop();

    setIsNoverlapWorking(false);
  }

  return (
    <div className="variables-block">
      <h2>Layout</h2>
      <div className="columns">
        <div className="column is-4">ForceAtlas2</div>
        <div className="column is-8">
          <div className="field has-addons">
            <p className="control">
              <Button
                isSize="small"
                style={{width: '30px', padding: '0px'}}
                disabled={isNoverlapWorking}
                isLoading={isFA2Working}
                onClick={startFA2}>
                {!isFA2Working ? <PlayIcon width={20} height={20} /> : null}
              </Button>
            </p>
            <p className="control">
              <Button
                isSize="small"
                style={{width: '30px', padding: '0px'}}
                disabled={!isFA2Working || isNoverlapWorking}
                onClick={stopFA2}>
                <PauseIcon width={20} height={20} />
              </Button>
            </p>
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
                isLoading={isNoverlapWorking}
                disabled={isFA2Working}
                onClick={startNoverlap}>
                {!isNoverlapWorking ? (
                  <PlayIcon width={20} height={20} />
                ) : null}
              </Button>
            </p>
            <p className="control">
              <Button
                isSize="small"
                style={{width: '30px', padding: '0px'}}
                disabled={!isNoverlapWorking || isFA2Working}
                onClick={stopNoverlap}>
                <PauseIcon width={20} height={20} />
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
