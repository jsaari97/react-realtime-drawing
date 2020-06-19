# React Realtime Draw

React hooks for drawing and spectating in real time.

## Features

- React hooks support :sparkles:
- Mouse- and touch-support :computer_mouse::point_up_2:
- Brush color and size support :paintbrush:
- Automatic canvas scaling :arrow_up_down:
- Lightweight, under 2kB gzipped :rocket:
- Dependency-free! :package:
- Built with TypeScript, typings included :computer:

## Usage

```jsx
import React from 'react';
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

## Installation

```bash
$ npm install react-realtime-drawing

# or using Yarn

$ yarn add react-realtime-drawing
```

## License

MIT © [jsaari97](https://github.com/jsaari97)
