import {
  Field,
  SmartContract,
  method,
  state,
  State,
  Poseidon,
  isReady,
  Struct,
  Circuit,
} from 'snarkyjs';
import { solutionColumns, solutionRows } from './circuitUtils.js';
import { Color, ColoredStreak } from './types.js';
import {
  ColumnClass,
  RowClass,
  secretNonogram,
  secretSolution,
} from './solutionNonogram.js';

export { SolutionNonogram, NonogramZkApp };

await isReady;

/**
 * Note: a Nonogram may have multiple solutions
 * https://math.stackexchange.com/a/1473350
 *
 * Therefore, we need the solution to consider the validity of a solution based off the row & column descriptions
 * and not the hash of the final image desired
 */

// function nonogramCtor(secretNonogram: {
//   rows: ColoredStreak[][],
//   columns: ColoredStreak[][],
// }) {

class SolutionNonogram extends Struct({
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
// }

// const secretSolution = genSecretSolution();
// const SolutionNonogram = nonogramCtor({
//   rows: solutionRows(secretSolution),
//   columns: solutionColumns(secretSolution),
// });

export class NonogramSubmission extends Struct({
  value: Circuit.array(
    Circuit.array(Color, secretSolution[0].length),
    secretSolution.length
  ),
}) {
  static from(value: Color[][]) {
    return new NonogramSubmission({
      value: value.map((row) => row.map(Field)),
    });
  }
}

// const expectedHash = Field(0);
const expectedHash = SolutionNonogram.fromJS(secretNonogram).hash();

class NonogramZkApp extends SmartContract {
  @state(Field) nonogramHash = State<Field>();

  events = {
    'solved-nonogram': Field,
  };

  @method init() {
    super.init();
    this.nonogramHash.set(expectedHash);
  }

  /**
   * Note: We don't check if the user has already solved a specific puzzle
   *       It's up to the frontend to check if the puzzle is already solved by the user
   */
  @method submitSolution(solutionInstance: NonogramSubmission) {
    const solutionValue = solutionInstance.value;
    const nonogram = SolutionNonogram.fromCircuit({
      rows: solutionRows(solutionValue),
      columns: solutionColumns(solutionValue),
    });

    // get contract puzzle hash
    let nonogramHash = this.nonogramHash.get();
    this.nonogramHash.assertEquals(nonogramHash);

    // check submission matches hash
    nonogram
      .hash()
      .assertEquals(
        nonogramHash,
        'nonogram does not match the one committed on-chain'
      );

    // TODO: reducer instead? Emit the public key instead?
    this.emitEvent('solved-nonogram', nonogram.hash());
  }
}
