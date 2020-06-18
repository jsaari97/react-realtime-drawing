import * as React from 'react';
import { PointPayload } from '../types';

interface CanvasDrawProps {
  ctx: CanvasRenderingContext2D | null;
  shouldDraw?: (payload: PointPayload[]) => boolean;
}

export const useCanvasDraw = ({
  ctx,
  shouldDraw,
}: CanvasDrawProps): ((payload: PointPayload[]) => void) => {
  const draw = React.useCallback(
    (payload: PointPayload[]) => {
      if (shouldDraw !== undefined) {
        if (!shouldDraw(payload)) {
          return;
        }
      }

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
    [ctx, shouldDraw]
  );

  return draw;
};
