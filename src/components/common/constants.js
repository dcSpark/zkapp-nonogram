export var DefaultDimensions = {
  ROWS: 5,
  COLS: 5,
};

export var SquareValue = {
  EMPTY: 1,
  FILLED: 2,
  MARKED: 3,
  properties: {
    1: {name: "empty"},
    2: {name: "filled"},
    3: {name: "marked"}
  }
};

export var DimensionsChoices = [
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