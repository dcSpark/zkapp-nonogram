import { Circuit, Field, Poseidon, Struct } from 'snarkyjs';
import { DynamicArray } from './dynamic';
import { maxColumnLen, maxRowLen, secretNonogram } from './solutionNonogram';
import { Color, ColoredStreak } from './types';

export const RowClass = DynamicArray(ColoredStreak, maxRowLen);
export const ColumnClass = DynamicArray(ColoredStreak, maxColumnLen);

/**
 * Note: a Nonogram may have multiple solutions
 * https://math.stackexchange.com/a/1473350
 *
 * Therefore, we need the solution to consider the validity of a solution based off the row & column descriptions
 * and not the hash of the final image desired
 */

export class SolutionNonogram extends Struct({
  rows: Circuit.array(RowClass, secretNonogram.rows.length),
  columns: Circuit.array(ColumnClass, secretNonogram.columns.length),
}) {
  static fromJS(nonogram: {
    rows: ColoredStreak[][];
    columns: ColoredStreak[][];
  }) {
    const circuitRows = [];
    for (const row of nonogram.rows) {
      const arr = new RowClass(row);
      circuitRows.push(arr);
    }

    const circuitColumns = [];
    for (const column of nonogram.columns) {
      const arr = new ColumnClass(column);
      circuitColumns.push(arr);
    }

    return new SolutionNonogram({ rows: circuitRows, columns: circuitColumns });
  }
  static fromCircuit(nonogram: {
    rows: InstanceType<typeof RowClass>[];
    columns: InstanceType<typeof ColumnClass>[];
  }) {
    return new SolutionNonogram({
      rows: nonogram.rows,
      columns: nonogram.columns,
    });
  }
  hash() {
    return Poseidon.hash([
      // encode length in hash to avoid MxN giving the same hash as a NxM
      Field(this.rows.length),
      Field(this.columns.length),
      ...this.rows.flatMap((row) => [
        row.length,
        ...row.values.flatMap((v) => [v.color, v.length]),
      ]),
      ...this.columns.flatMap((column) => [
        column.length,
        ...column.values.flatMap((v) => [v.color, v.length]),
      ]),
    ]);
  }
}

export class NonogramSubmission extends Struct({
  value: Circuit.array(
    Circuit.array(Color, secretNonogram.columns.length),
    secretNonogram.rows.length
  ),
}) {
  static from(value: Color[][]) {
    return new NonogramSubmission({
      value,
    });
  }
}
