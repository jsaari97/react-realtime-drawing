import * as React from 'react';
import { PointPayload, RealtimeViewerValue } from '../types';
import { useCanvasReset } from '../common/useCanvasReset';
import { useStrokeApply } from '../common/useStrokeApply';
import { useCanvasDraw } from '../common/useCanvasDraw';

export const useRealtimeViewer = (): RealtimeViewerValue => {
  const ref = React.useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = React.useState<CanvasRenderingContext2D | null>(null);
  const count = React.useRef<number>(0);
  const [dirty, setDirty] = React.useState<boolean>(false);

  const handleApply = React.useCallback(() => {
    count.current = 0;
  }, []);

  const applyStroke = useStrokeApply({ ref, ctx, onApply: handleApply });

  const handleDraw = React.useCallback(
    (payload: PointPayload[]): void => {
      if (!dirty) {
        setDirty(true);
      }

      if (
        (payload.length === 1 && count.current === 0) ||
        payload.length < count.current
      ) {
        applyStroke();
      } else {
        count.current = payload.length;
      }
    },
    [applyStroke, dirty]
  );

  const drawToCanvas = useCanvasDraw({ ctx, onDraw: handleDraw });

  const handleReset = React.useCallback(() => {
    count.current = 0;
    setDirty(false);
  }, []);

  const reset = useCanvasReset({ ref, ctx, onReset: handleReset });

  React.useEffect(() => {
    if (ref.current) {
      if (ctx) {
        return;
      }

      if (!ref.current.parentElement) {
        console.warn('canvas needs to be inside a parent node');
        return;
      }

      // Setup
      const { width, height } =
        ref.current.parentElement.getBoundingClientRect();

      ref.current.parentElement.style.position = 'relative';
      ref.current.height = height;
      ref.current.width = width;

      const canvas = document.createElement('canvas');
      canvas.style.position = 'absolute';
      canvas.style.left = '0';
      canvas.style.top = '0';
      canvas.height = height;
      canvas.width = width;
      canvas.style.pointerEvents = 'none';
      ref.current.parentElement.insertAdjacentElement('beforeend', canvas);
      setCtx(canvas.getContext('2d'));
    }
  }, [ref, ctx]);

  return [ref, drawToCanvas, { reset, dirty }];
};
