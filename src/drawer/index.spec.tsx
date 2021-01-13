import React from 'react'; // eslint-disable-line no-use-before-define
import { useRealtimeDrawer } from '.';
import { renderHook } from '@testing-library/react-hooks';

const wrapper: React.FC = ({ children }) => <div>{children}</div>;

describe('useRealtimeDrawer', () => {
  it('should return null if no ref handle', async () => {
    const { result } = renderHook(() => useRealtimeDrawer(), { wrapper });

    const [ref] = result.current;

    expect(ref.current).toBeNull();
  });

  it('should warn if no parent', async () => {
    global.console.warn = jest.fn();

    const { result } = renderHook(
      () => {
        const ref = useRealtimeDrawer();
        const canvas = document.createElement('canvas');

        React.useImperativeHandle(ref[0], () => canvas);

        return ref;
      },
      { wrapper }
    );

    const [ref] = result.current;

    expect(console.warn).toBeCalled();
    expect(ref.current?.tagName).toEqual('CANVAS');
  });

  it('should initialize if parent', async () => {
    const { result } = renderHook(
      () => {
        const ref = useRealtimeDrawer();
        const parent = document.createElement('div');
        const canvas = document.createElement('canvas');
        parent.appendChild(canvas);

        React.useImperativeHandle(ref[0], () => canvas);

        return ref;
      },
      { wrapper }
    );

    const [ref] = result.current;

    expect(ref.current?.tagName).toEqual('CANVAS');
  });
});
