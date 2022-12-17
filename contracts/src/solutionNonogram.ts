import { isReady } from 'snarkyjs';
import { ColoredStreak } from './types.js';
import { DynamicArray } from './dynamic.js';
import { solutionColumns, solutionRows } from './jsUtils.js';
import { genSecretSolution } from './solution.js';

await isReady;

export const secretSolution = genSecretSolution();
export const secretNonogram = {
  rows: solutionRows(secretSolution),
  columns: solutionColumns(secretSolution),
};

export const maxRowLen = Math.max(
  ...secretNonogram.rows.map((row) => row.length)
);
export const RowClass = DynamicArray(ColoredStreak, maxRowLen);

export const maxColumnLen = Math.max(
  ...secretNonogram.columns.map((column) => column.length)
);
export const ColumnClass = DynamicArray(ColoredStreak, maxColumnLen);
