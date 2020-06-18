/* eslint-disable-next-line @typescript-eslint/no-empty-interface */
interface SvgrComponent extends React.FC<React.SVGAttributes<SVGElement>> {}

declare module '*.svg' {
  const svgUrl: string;
  const svgComponent: SvgrComponent;
  export default svgUrl;
  export { svgComponent as ReactComponent };
}
