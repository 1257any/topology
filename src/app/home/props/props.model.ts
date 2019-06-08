import { Rect } from 'libs/topology/models/rect';
import { Point } from 'libs/topology/models/point';

export interface Props {
  type: string;
  data?: {
    id?: string;
    name?: string;
    dash: number;
    lineWidth: number;
    strokeStyle: string;
    fillStyle: string;
    globalAlpha: number;
    rotate: number;
    font: {
      color: string;
      fontFamily: string;
      fontSize: number;
      lineHeight: number;
      textAlign: CanvasTextAlign;
      textBaseline: CanvasTextBaseline;
    };
    data?: any;

    // Node
    rect?: Rect;
    borderRadius?: number;
    icon?: string;
    iconFamily?: string;
    iconSize?: number;
    iconColor?: string;
    image?: string;
    text?: string;
    textMaxLine?: number;
    // End

    // Line
    from?: Point;
    to?: Point;
    fromArrow?: string;
    toArrow?: string;
    // End
  };
}
