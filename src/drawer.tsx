import * as React from 'react';
import {
  RealtimeDrawerOptions,
  RealtimeDrawerValue,
  PointPayload,
} from './types';

export const useRealtimeDrawer = ({
  strokeWidth = 5,
  color = '#000',
  refreshRate = 3,
  onChange,
}: RealtimeDrawerOptions = {}): RealtimeDrawerValue => {
  const ref = React.useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = React.useState<CanvasRenderingContext2D | null>(null);
  const count = React.useRef<number>(0);
  const points = React.useRef<PointPayload[]>([]);

  const [mouseDown, setMouseDown] = React.useState<boolean>(false);

  const applyStroke = React.useCallback(() => {
    setMouseDown(false);

    if (ref.current && ctx) {
      ref.current.onmousemove = null;
      ref.current.ontouchmove = null;

      points.current = [];
      count.current = 0;
      const c = ref.current.getContext('2d');
      if (c) {
        c.drawImage(ctx.canvas, 0, 0);
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      }
    }
  }, [ctx, ref.current]);

  const drawToCanvas = React.useCallback(
    (payload: PointPayload[]) => {
      if (ctx && payload.length) {
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.strokeStyle = payload[0].color;
        ctx.fillStyle = payload[0].color;
        ctx.lineWidth = payload[0].strokeWidth;

        ctx.clearRect(0, 0, payload[0].canvas.width, payload[0].canvas.height);

        if (payload.length < refreshRate) {
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
    [ctx, refreshRate]
  );

  const handleDraw = React.useCallback(
    (e: TouchEvent | MouseEvent) => {
      if (ref.current) {
        // increment frame count
        count.current++;

        if (count.current % refreshRate === 0 || count.current < refreshRate) {
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
    [ref.current, drawToCanvas, refreshRate, color, strokeWidth, onChange]
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

  const reset = React.useCallback(() => {
    count.current = 0;
    points.current = [];

    if (ctx && ref.current) {
      const { height, width } = ctx.canvas.getBoundingClientRect();

      ctx.clearRect(
        0,
        0,
        width * window.devicePixelRatio,
        height * window.devicePixelRatio
      );

      const rCtx = ref.current.getContext('2d');
      if (rCtx) {
        rCtx.clearRect(
          0,
          0,
          width * window.devicePixelRatio,
          height * window.devicePixelRatio
        );
      }
    }
  }, [ctx, ref.current]);

  return [ref, { reset }];
};
