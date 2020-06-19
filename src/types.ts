export interface PointPayload {
  x: number;
  y: number;
  color: string;
  strokeWidth: number;
  ratio: number;
}

export type onChangeMethod = (payload: PointPayload[]) => void;

export interface RealtimeDrawerOptions {
  strokeWidth?: number;
  color?: string;
  onChange?: onChangeMethod;
}

export interface RealtimeCommonHookOptions {
  reset: () => void;
}

/* eslint-disable @typescript-eslint/no-empty-interface */
interface RealtimeDrawerHookOptions extends RealtimeCommonHookOptions {}
interface RealtimeViewerHookOptions extends RealtimeCommonHookOptions {}

export type RealtimeDrawerValue = [
  React.RefObject<HTMLCanvasElement>,
  RealtimeDrawerHookOptions
];

export type RealtimeViewerValue = [
  React.RefObject<HTMLCanvasElement>,
  onChangeMethod,
  RealtimeViewerHookOptions
];
