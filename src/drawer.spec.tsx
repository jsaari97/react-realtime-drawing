import * as React from 'react';
import { useRealtimeDrawer } from './drawer';
import { renderHook } from '@testing-library/react-hooks';

describe('useRealtimeDrawer', () => {
  it('should return null if no ref handle', async () => {
    const { result } = renderHook(() => useRealtimeDrawer());

    const refContainer = result.current[0];

    expect(Object.keys(refContainer)).toEqual(['current']);
    expect(refContainer.current).toBeNull();
  });

  it('should return ref element', async () => {
    const { result } = renderHook(() => {
      const ref = useRealtimeDrawer();
      const canvas = document.createElement('canvas');
      React.useImperativeHandle(ref[0], () => canvas);
      return ref;
    });

    const refContainer = result.current[0];

    expect(Object.keys(refContainer)).toEqual(['current']);
    expect(refContainer.current?.tagName).toEqual('CANVAS');
  });
});
