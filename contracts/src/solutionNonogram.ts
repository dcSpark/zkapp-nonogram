import { isReady } from 'snarkyjs';
import { ColoredStreak } from './types';
import { DynamicArray } from './dynamic';
import { solutionColumns, solutionRows } from './jsUtils';
import { genSecretSolution } from './solution';

await isReady;

export const secretSolution = genSecretSolution();
export const secretNonogram = {
  rows: solutionRows(secretSolution),
  columns: solutionColumns(secretSolution),
};

console.log(JSON.stringify(secretNonogram));

export const maxRowLen = Math.max(
  ...secretNonogram.rows.map((row) => row.length)
);
export const RowClass = DynamicArray(ColoredStreak, maxRowLen);

export const maxColumnLen = Math.max(
  ...secretNonogram.columns.map((column) => column.length)
);
export const ColumnClass = DynamicArray(ColoredStreak, maxColumnLen);
