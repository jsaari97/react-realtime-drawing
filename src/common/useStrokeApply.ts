import * as React from 'react';

interface StrokeApplyProps {
  ref: React.RefObject<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D | null;
  onApply?: () => void;
}

export const useStrokeApply = ({
  ref,
  ctx,
  onApply,
}: StrokeApplyProps): (() => void) => {
  const apply = React.useCallback(() => {
    if (ctx && ref.current) {
      if (onApply) {
        onApply();
      }

      const context = ref.current.getContext('2d');

      if (context) {
        context.drawImage(ctx.canvas, 0, 0);
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      }
    }
  }, [ctx, ref, onApply]);

  return apply;
};
