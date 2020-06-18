import * as React from 'react';
import {
  RealtimeDrawerOptions,
  RealtimeDrawerValue,
  PointPayload,
} from '../types';
import { useCanvasReset } from '../common/useCanvasReset';
import { useStrokeApply } from '../common/useStrokeApply';
import { useCanvasDraw } from '../common/useCanvasDraw';

export const useRealtimeDrawer = ({
  strokeWidth = 16,
  color = '#000',
  onChange,
}: RealtimeDrawerOptions = {}): RealtimeDrawerValue => {
  const ref = React.useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = React.useState<CanvasRenderingContext2D | null>(null);
  const count = React.useRef<number>(0);
  const points = React.useRef<PointPayload[]>([]);

  const [mouseDown, setMouseDown] = React.useState<boolean>(false);

  const handleApply = React.useCallback(() => {
    setMouseDown(false);

    if (ref.current && ctx) {
      ref.current.onmousemove = null;
      ref.current.ontouchmove = null;

      points.current = [];
      count.current = 0;
    }
  }, [ref, ctx]);

  const applyStroke = useStrokeApply({ ref, ctx, onApply: handleApply });

  const drawToCanvas = useCanvasDraw({ ctx });

  const handleDraw = React.useCallback(
    (e: TouchEvent | MouseEvent) => {
      if (ref.current) {
        // increment frame count
        count.current++;

        if (count.current % 2 === 0 || count.current < 3) {
          const { width, height } = ref.current.getBoundingClientRect();

          // Get cursor coordinates from mouse or touch event
          const pageX =
            e instanceof TouchEvent ? e.changedTouches[0].pageX : e.pageX;
          const pageY =
            e instanceof TouchEvent ? e.changedTouches[0].pageY : e.pageY;

          const payload: PointPayload = {
            x: Math.floor(pageX - ref.current.offsetLeft),
            y: Math.floor(pageY - ref.current.offsetTop),
            color,
            strokeWidth,
            canvas: {
              width,
              height,
            },
          };

          points.current.push(payload);

          if (onChange) {
            onChange(points.current);
          }

          drawToCanvas(points.current);
        }
      }
    },
    [ref.current, drawToCanvas, color, strokeWidth, onChange]
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

  React.useEffect(() => {
    if (ref.current) {
      // events
      const start = (e: MouseEvent | TouchEvent) => {
        setMouseDown(true);
        handleDraw(e);
      };

      // attach events
      if ('ontouchstart' in window) {
        ref.current.ontouchstart = start;
        ref.current.ontouchend = applyStroke;
        ref.current.ontouchcancel = applyStroke;
      } else {
        ref.current.onmousedown = start;
        ref.current.onmouseleave = applyStroke;
        ref.current.onmouseup = applyStroke;
      }
    }
  }, [ref.current, drawToCanvas, applyStroke, handleDraw]);

  React.useEffect(() => {
    if (mouseDown && ref.current) {
      if ('ontouchstart' in window) {
        ref.current.ontouchmove = handleDraw;
      } else {
        ref.current.onmousemove = handleDraw;
      }
    }
  }, [mouseDown, ref.current, ctx]);

  const handleReset = React.useCallback(() => {
    count.current = 0;
    points.current = [];
  }, []);

  const reset = useCanvasReset({ ref, ctx, onReset: handleReset });

  return [ref, { reset }];
};
