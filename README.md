# React Realtime Draw

React hooks for drawing and viewing the drawing in real time.

## Usage

```jsx
import * as React from 'react';
import { useRealtimeDrawer, useRealtimeViewer } from 'react-realtime-drawing';

export default () => {
  const [viewerRef, { onChange }] = useRealtimeViewer();

  const [drawerRef] = useRealtimeDrawer({
    color: '#00ffaa',
    onChange
  });

  return (
    <div>
      <div style={{ width: 512, height: 512 }}>
        <canvas ref={drawerRef} />
      </div>
      <div style={{ width: 512, height: 512 }}>
        <canvas ref={viewerRef} />
      </div>
    </div>
  );
}
```

## Install

```bash
$ npm install react-realtime-drawing

# or using Yarn

$ yarn add react-realtime-drawing
```

## License

MIT © [jsaari97](https://github.com/jsaari97)
