import * as React from 'react';

interface CanvasResetProps {
  ref: React.RefObject<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D | null;
  onReset?: () => void;
}

export const useCanvasReset = ({
  ref,
  ctx,
  onReset,
}: CanvasResetProps): (() => void) => {
  const reset = React.useCallback(() => {
    if (ctx && ref.current) {
      if (onReset) {
        onReset();
      }

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
  }, [ctx, ref, onReset]);

  return reset;
};
