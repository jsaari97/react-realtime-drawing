import * as React from 'react';
import { PointPayload } from '../types';

interface CanvasDrawProps {
  ctx: CanvasRenderingContext2D | null;
  onDraw?: (payload: PointPayload[]) => void;
}

export const useCanvasDraw = ({
  ctx,
  onDraw,
}: CanvasDrawProps): ((payload: PointPayload[]) => void) => {
  const draw = React.useCallback(
    (payload: PointPayload[]) => {
      if (onDraw) {
        onDraw(payload);
      }

      if (ctx && payload.length) {
        const { width, height } = ctx.canvas.getBoundingClientRect();

        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.strokeStyle = payload[0].color;
        ctx.fillStyle = payload[0].color;
        ctx.lineWidth = Math.floor(
          payload[0].strokeWidth * Math.sqrt(width ** 2 + height ** 2)
        );

        ctx.clearRect(0, 0, width, height);

        if (payload.length < 3) {
          ctx.beginPath();
          ctx.arc(
            payload[0].x * width,
            payload[0].y * height,
            ctx.lineWidth / 2,
            0,
            Math.PI * 2
          );
          ctx.fill();
          ctx.closePath();

          return;
        }

        ctx.beginPath();
        ctx.moveTo(payload[0].x * width, payload[0].y * height);

        // eslint-disable-next-line no-var
        for (var i = 1; i < payload.length - 2; i++) {
          ctx.quadraticCurveTo(
            payload[i].x * width,
            payload[i].y * height,
            ((payload[i].x + payload[i + 1].x) * width) / 2,
            ((payload[i].y + payload[i + 1].y) * height) / 2
          );
        }

        // For the last 2 points
        ctx.quadraticCurveTo(
          payload[i].x * width,
          payload[i].y * height,
          payload[i + 1].x * width,
          payload[i + 1].y * height
        );

        ctx.stroke();
      }
    },
    [ctx, onDraw]
  );

  return draw;
};
