import React, {useEffect, useState, useRef} from 'react';
import Graph from 'graphology';
import {Button} from 'bloomer';
import PlayIcon from 'material-icons-svg/components/baseline/PlayArrow';
import PauseIcon from 'material-icons-svg/components/baseline/Pause';
import fa2Layout from 'graphology-layout-forceatlas2';
import FA2LayoutSupervisor from 'graphology-layout-forceatlas2/worker';

type LayoutProps = {
  graph: Graph;
};

export default function Layout({graph}: LayoutProps) {
  const fa2 = useRef(null);
  const [isFA2Working, setIsFA2Working] = useState(false);

  useEffect(() => {
    if (graph)
      fa2.current = new FA2LayoutSupervisor(graph, {
        settings: fa2Layout.inferSettings(graph)
      });

    return () => {
      if (fa2.current) {
        console.log('Killing FA2');
        fa2.current.kill();
      }
    };
  }, [graph]);

  function startFA2() {
    if (isFA2Working || !fa2.current) return;

    fa2.current.start();

    setIsFA2Working(true);
  }

  function stopFA2() {
    if (!isFA2Working || !fa2.current) return;

    fa2.current.stop();

    setIsFA2Working(false);
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
                isLoading={isFA2Working}
                onClick={startFA2}>
                {!isFA2Working ? <PlayIcon width={20} height={20} /> : null}
              </Button>
            </p>
            <p className="control">
              <Button
                isSize="small"
                style={{width: '30px', padding: '0px'}}
                disabled={!isFA2Working}
                onClick={stopFA2}>
                <PauseIcon width={20} height={20} />
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
