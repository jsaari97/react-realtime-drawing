import * as React from 'react';
import { PointPayload, RealtimeViewerValue } from '../types';

export const useRealtimeViewer = (): RealtimeViewerValue => {
  const ref = React.useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = React.useState<CanvasRenderingContext2D | null>(null);
  const count = React.useRef<number>(0);

  const applyStroke = React.useCallback(() => {
    if (ref.current && ctx) {
      count.current = 0;

      const context = ref.current.getContext('2d');
      if (context) {
        context.drawImage(ctx.canvas, 0, 0);
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      }
    }
  }, [ctx, ref.current]);

  const drawToCanvas = React.useCallback(
    (payload: PointPayload[]) => {
      if (payload.length <= count.current) {
        applyStroke();

        return;
      }

      count.current = payload.length;

      if (ctx && payload.length) {
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.strokeStyle = payload[0].color;
        ctx.fillStyle = payload[0].color;
        ctx.lineWidth = payload[0].strokeWidth;

        ctx.clearRect(0, 0, payload[0].canvas.width, payload[0].canvas.height);

        if (payload.length < 3) {
          ctx.beginPath();
          ctx.arc(
            payload[0].x,
            payload[0].y,
            ctx.lineWidth / 2,
            0,
            Math.PI * 2
          );
          ctx.fill();
          ctx.closePath();

          return;
        }

        ctx.beginPath();
        ctx.moveTo(payload[0].x, payload[0].y);

        // eslint-disable-next-line no-var
        for (var i = 1; i < payload.length - 2; i++) {
          ctx.quadraticCurveTo(
            payload[i].x,
            payload[i].y,
            (payload[i].x + payload[i + 1].x) / 2,
            (payload[i].y + payload[i + 1].y) / 2
          );
        }

        // For the last 2 points
        ctx.quadraticCurveTo(
          payload[i].x,
          payload[i].y,
          payload[i + 1].x,
          payload[i + 1].y
        );

        ctx.stroke();
      }
    },
    [ctx, applyStroke]
  );

  React.useEffect(() => {
    if (ref.current) {
      if (!ref.current.parentElement) {
        console.warn('canvas needs to be inside a parent node');
        return;
      }

      if (ref.current.parentElement.querySelector('#realtime-canvas')) {
        return;
      }

      // Setup
      const {
        width,
        height,
      } = ref.current.parentElement.getBoundingClientRect();

      ref.current.parentElement.style.position = 'relative';
      ref.current.height = height;
      ref.current.width = width;

      const canvas = document.createElement('canvas');
      canvas.id = 'realtime-canvas';
      canvas.style.position = 'absolute';
      canvas.style.left = '0';
      canvas.style.top = '0';
      canvas.height = height;
      canvas.width = width;
      canvas.style.pointerEvents = 'none';
      ref.current.parentElement.insertAdjacentElement('beforeend', canvas);
      setCtx(canvas.getContext('2d'));
    }
  }, [ref.current]);

  const reset = React.useCallback(() => {
    count.current = 0;

    if (ctx && ref.current) {
      const { height, width } = ctx.canvas.getBoundingClientRect();

      ctx.clearRect(
        0,
        0,
        width * window.devicePixelRatio,
        height * window.devicePixelRatio
      );

      const refContext = ref.current.getContext('2d');
      if (refContext) {
        refContext.clearRect(
          0,
          0,
          width * window.devicePixelRatio,
          height * window.devicePixelRatio
        );
      }
    }
  }, [ctx, ref.current]);

  return [ref, drawToCanvas, { reset }];
};
