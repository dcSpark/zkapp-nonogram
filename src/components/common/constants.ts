import chroma from 'chroma-js';

export const DefaultDimensions = {
  ROWS: 5,
  COLS: 5,
} as const;

export type Color = number;

export enum SquareFill {
  EMPTY,
  FILLED,
  MARKED,
}

export type SquareValue =
  | {
      state: SquareFill.EMPTY | SquareFill.MARKED;
    }
  | {
      state: SquareFill.FILLED;
      color: Color;
    };

export function squareStateEqual(s1: SquareValue, s2: SquareValue): boolean {
  if (s1.state !== s2.state) return false;
  if (s1.state !== SquareFill.FILLED || s2.state !== SquareFill.FILLED) return true;
  if (s1.color !== s2.color) return false;
  return true;
}

export const DimensionsChoices: [number, number][] = [
  [5, 5],
  [10, 5],
  [10, 10],
  [15, 10],
  [15, 15],
  [20, 15],
  [20, 20],
  [25, 20],
  [25, 25],
  [30, 25],
  [30, 30],
];

export function createColors(numColors: number) {
  if (numColors === 1) return ['#353235'];
  return chroma.scale('Set1').mode('lab').colors(numColors);
}
