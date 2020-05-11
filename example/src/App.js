import React, { useState } from 'react';
import { useRealtimeDrawing } from 'react-realtime-draw';

const colors = ['#626262', '#97ad7d', '#ca4400'];
const widths = [2, 5, 10];

const App = () => {
  const [color, setColor] = useState('#626262');
  const [strokeWidth, setStrokeWidth] = useState(5);

  const [ref] = useRealtimeDrawing({
    color,
    strokeWidth,
  });

  return (
    <div>
      <div style={{ height: 512, width: 512 }}>
        <canvas ref={ref} />
      </div>
      <div>
        <div>
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              style={{ ...styles.button, background: c }}
            />
          ))}
        </div>
        <div>
          {widths.map((w) => (
            <button
              key={w}
              onClick={() => setStrokeWidth(w)}
              style={{ ...styles.button }}
            >
              {w}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  button: {
    background: '#f1f1f1',
    height: 32,
    width: 32,
    border: 0,
    outline: 0,
  },
};

export default App;
