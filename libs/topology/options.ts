export interface Options {
  width?: string | number;
  height?: string | number;
  color?: string;
  activeColor?: string;
  hoverColor?: string;
  dragColor?: string;
  font?: {
    color: string;
    fontFamily: string;
    fontSize: number;
    lineHeight: number;
    textAlign: CanvasTextAlign;
    textBaseline: CanvasTextBaseline;
  };
}
