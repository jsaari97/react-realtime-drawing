import * as React from 'react';
import './main.css';
import { useRealtimeDrawer, useRealtimeViewer } from 'react-realtime-drawing';
import { Swatches } from './components/swatches';
import { Sizes } from './components/sizes';
import { Footer } from './components/footer';
import { Header } from './components/header';

const App = () => {
  const [color, setColor] = React.useState('#134e6f');
  const [strokeWidth, setStrokeWidth] = React.useState(16);

  const [viewerRef, onChange, { reset: resetViewer }] = useRealtimeViewer();

  const [drawerRef, { reset: resetDrawer, dirty }] = useRealtimeDrawer({
    color,
    strokeWidth,
    onChange,
  });

  const handleReset = React.useCallback(() => {
    resetDrawer();
    resetViewer();
  }, [resetDrawer, resetViewer]);

  console.log(dirty);

  return (
    <div className='app-container'>
      <Header />
      <main className='container'>
        <div className='canvas-container'>
          <div className='canvas'>
            <canvas ref={drawerRef} />
            {!dirty && (
              <span className='canvas-hint'>
                Start drawing!&nbsp;
                <span role='img' aria-label='paintbrush'>
                  🖌
                </span>
              </span>
            )}
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
      </main>
      <Footer />
    </div>
  );
};

export default App;
