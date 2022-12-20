import { Circuit, Field, isReady, Poseidon, Struct } from 'snarkyjs';
import { DynamicArray } from './dynamic.js';
import { gameInfo, JsonStreak } from './input.js';
import { Color, ColoredStreak } from './types.js';

await isReady;

function jsonToStreakInfo(json: {
  rows: JsonStreak[][];
  columns: JsonStreak[][];
}): StreaksInfo {
  return {
    rows: json.rows.map((row) =>
      row.map((streak) => ({
        color: new Color(streak.color),
        length: Field(streak.length),
      }))
    ),
    columns: json.columns.map((column) =>
      column.map((streak) => ({
        color: new Color(streak.color),
        length: Field(streak.length),
      }))
    ),
  };
}

export const circuitGameInfo: {
  rows: ColoredStreak[][];
  columns: ColoredStreak[][];
} = jsonToStreakInfo(gameInfo);

export type StreaksInfo = {
  rows: ColoredStreak[][];
  columns: ColoredStreak[][];
};

export const RowClass = DynamicArray(ColoredStreak, gameInfo.rows.length);
export const ColumnClass = DynamicArray(ColoredStreak, gameInfo.columns.length);

/**
 * Note: a Nonogram may have multiple solutions
 * https://math.stackexchange.com/a/1473350
 *
 * Therefore, we need the solution to consider the validity of a solution based off the row & column descriptions
 * and not the hash of the final image desired
 */

export class SolutionNonogram extends Struct({
  rows: Circuit.array(RowClass, gameInfo.rows.length),
  columns: Circuit.array(ColumnClass, gameInfo.columns.length),
}) {
  static fromJS(nonogram: StreaksInfo) {
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
    Circuit.array(Color, gameInfo.columns.length),
    gameInfo.rows.length
  ),
}) {
  static from(value: Color[][]) {
    return new NonogramSubmission({
      value,
    });
  }
}
