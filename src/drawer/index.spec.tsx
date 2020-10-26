import React from 'react'; // eslint-disable-line no-use-before-define
import { useRealtimeDrawer } from '.';
import { renderHook, HookResult } from '@testing-library/react-hooks';
import { RealtimeDrawerValue } from '../types';

const getRef = (result: HookResult<RealtimeDrawerValue>): RealtimeDrawerValue =>
  result.current;

const wrapper: React.FC = ({ children }) => <div>{children}</div>;

describe('useRealtimeDrawer', () => {
  it('should return null if no ref handle', async () => {
    const { result } = renderHook(() => useRealtimeDrawer(), { wrapper });

    const [ref] = getRef(result);

    expect(Object.keys(ref)).toEqual(['current']);
    expect(ref.current).toBeNull();
  });

  it('should return ref element', async () => {
    const { result } = renderHook(
      () => {
        const ref = useRealtimeDrawer();
        const canvas = document.createElement('canvas');
        React.useImperativeHandle(ref[0], () => canvas);

        return ref;
      },
      { wrapper }
    );

    const [ref] = getRef(result);

    expect(Object.keys(ref)).toEqual(['current']);
    expect(ref.current?.tagName).toEqual('CANVAS');
  });
});
