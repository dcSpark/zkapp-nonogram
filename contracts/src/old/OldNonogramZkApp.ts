import { Field, SmartContract, method, state, State, isReady } from 'snarkyjs';
import { NonogramSubmission, SolutionNonogram } from '../common/ioTypes.js';
import { Color } from '../common/types.js';
import { solutionColumns, solutionRows } from './circuitUtils.js';

export { OldNonogramZkApp };

await isReady;

// const expectedHash = SolutionNonogram.fromJS(secretNonogram).hash();
// console.log(expectedHash.toBigInt());

class OldNonogramZkApp extends SmartContract {
  @state(Field) nonogramHash = State<Field>();

  init() {
    super.init();
    this.nonogramHash.set(
      Field(
        // expectedHash // - doesn't work when deploying (?) - needs to be a static constant
        25134448949193411911263289606790727633601303035954420118353984288310600161763n
      )
    );
  }

  /**
   * Note: We don't check if the user has already solved a specific puzzle
   *       It's up to the frontend to check if the puzzle is already solved by the user
   */
  @method submitSolution(solutionInstance: NonogramSubmission) {
    const noColor = Color.noColor();
    const solutionValue = solutionInstance.value;
    const nonogram = SolutionNonogram.fromCircuit({
      rows: solutionRows(solutionValue, noColor),
      columns: solutionColumns(solutionValue, noColor),
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
  }
}
