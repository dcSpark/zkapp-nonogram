import { solutionColumns, solutionRows } from './jsUtils';
import { genSecretSolution } from './solution';

export const secretSolution = await genSecretSolution();
export const secretNonogram = {
  rows: solutionRows(secretSolution),
  columns: solutionColumns(secretSolution),
};

console.log(JSON.stringify(secretNonogram));

export const maxRowLen = Math.max(
  ...secretNonogram.rows.map((row) => row.length)
);

export const maxColumnLen = Math.max(
  ...secretNonogram.columns.map((column) => column.length)
);
