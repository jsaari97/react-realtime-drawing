import * as React from 'react';

interface Coordinate {
  x: number;
  y: number;
}

interface RealtimeDrawerOptions {
  strokeWidth?: number;
  color?: string;
  refreshRate?: number;
}

export const useRealtimeDrawer = ({
  strokeWidth = 5,
  color = '#000',
  refreshRate = 3,
}: RealtimeDrawerOptions = {}) => {
  const ref = React.useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = React.useState<CanvasRenderingContext2D | null>(null);
  const count = React.useRef<number>(0);
  const points = React.useRef<Coordinate[]>([]);

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

  const drawToCanvas = React.useCallback(() => {
    if (ctx) {
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = strokeWidth;

      const { height, width } = ctx.canvas.getBoundingClientRect();

      ctx.clearRect(
        0,
        0,
        width * window.devicePixelRatio,
        height * window.devicePixelRatio
      );

      if (points.current.length < refreshRate) {
        ctx.beginPath();
        ctx.arc(
          points.current[0].x,
          points.current[0].y,
          ctx.lineWidth / 2,
          0,
          Math.PI * 2
        );
        ctx.fill();
        ctx.closePath();

        return;
      }

      ctx.beginPath();
      ctx.moveTo(points.current[0].x, points.current[0].y);

      for (var i = 1; i < points.current.length - 2; i++) {
        ctx.quadraticCurveTo(
          points.current[i].x,
          points.current[i].y,
          (points.current[i].x + points.current[i + 1].x) / 2,
          (points.current[i].y + points.current[i + 1].y) / 2
        );
      }

      // For the last 2 points
      ctx.quadraticCurveTo(
        points.current[i].x,
        points.current[i].y,
        points.current[i + 1].x,
        points.current[i + 1].y
      );

      ctx.stroke();
    }
  }, [ctx, color, strokeWidth, refreshRate]);

  const handleDraw = React.useCallback(
    (e: TouchEvent | MouseEvent) => {
      if (ref.current) {
        // Get cursor coordinates from mouse or touch event
        const pageX =
          e instanceof TouchEvent ? e.changedTouches[0].pageX : e.pageX;
        const pageY =
          e instanceof TouchEvent ? e.changedTouches[0].pageY : e.pageY;

        // calculate XY coordinates taking account of container offset
        const point = {
          x: Math.floor(pageX - ref.current.offsetLeft),
          y: Math.floor(pageY - ref.current.offsetTop),
        };

        // increment frame count
        count.current++;

        // check refresh interval if it should draw
        if (count.current % refreshRate === 0) {
          points.current.push(point);
          drawToCanvas();
        } else if (count.current < refreshRate) {
          points.current.push(point);
          drawToCanvas();
        }
      }
    },
    [ref.current, drawToCanvas, refreshRate]
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

  return [ref];
};

export const useRealtimeViewer = () => {
  const ref = React.useRef<HTMLCanvasElement>(null);

  return [ref];
};
