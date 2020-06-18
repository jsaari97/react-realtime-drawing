import * as React from 'react';
import './main.css';
import { useRealtimeDrawer, useRealtimeViewer } from 'react-realtime-drawing';
import { Swatches } from './components/swatches';
import { Sizes } from './components/sizes';

const App = () => {
  const [color, setColor] = React.useState('#134e6f');
  const [strokeWidth, setStrokeWidth] = React.useState(16);

  const [viewerRef, onChange, { reset: resetViewer }] = useRealtimeViewer();

  const [drawerRef, { reset: resetDrawer }] = useRealtimeDrawer({
    color,
    strokeWidth,
    onChange,
  });

  const handleReset = React.useCallback(() => {
    resetDrawer();
    resetViewer();
  }, [resetDrawer, resetViewer]);

  return (
    <div className='container'>
      <h1 className='app-header'>React Realtime Drawing</h1>
      <div className='canvas-container'>
        <div className='canvas'>
          <canvas ref={drawerRef} />
        </div>
        <div className='canvas'>
          <canvas ref={viewerRef} />
        </div>
      </div>
      <div className='controls'>
        <div>
          <Swatches current={color} onChange={setColor} />
        </div>
        <div>
          <Sizes current={strokeWidth} onChange={setStrokeWidth} />
        </div>
        <div>
          <button className='reset-button' onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
