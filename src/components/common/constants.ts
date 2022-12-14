export const DefaultDimensions = {
  ROWS: 5,
  COLS: 5,
} as const;

export enum SquareValue {
  EMPTY,
  FILLED,
  MARKED,
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
