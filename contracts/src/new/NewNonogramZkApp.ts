import {
  Field,
  SmartContract,
  method,
  state,
  State,
  isReady,
  Circuit,
} from 'snarkyjs';
import { gameInfo } from '../common/input.js';
import {
  NonogramSubmission,
  SolutionNonogram,
  RowClass,
  ColumnClass,
  circuitGameInfo,
} from '../common/ioTypes.js';
import { Color } from '../common/types.js';

await isReady;

function checkRowCircuit(
  row: Color[],
  noColor: Color,
  streaks: InstanceType<typeof RowClass> | InstanceType<typeof ColumnClass>
) {
  let streakIndex = Field(-1);
  let currentRun = {
    color: noColor,
    left: Field(0),
  };
  for (let j = 0; j < row.length; j++) {
    const matchCurrentColor = row[j].equals(currentRun.color);
    const isNoColor = row[j].equals(noColor);

    // matchCurrentColor = true
    {
      const ignoreBranch = matchCurrentColor.not();
      const lengthChange = Circuit.if(
        ignoreBranch.or(currentRun.color.equals(noColor)),
        Field(0),
        Field(1)
      );
      // note: we don't actually need to check currentRun.left here
      // as it's already checked for us either in the `matchCurrentColor = false` case or when the function terminates
      // currentRun.left.gte(lengthChange).or(ignoreBranch).assertTrue();
      currentRun.left = currentRun.left.sub(lengthChange);
    }
    // matchCurrentColor = false
    {
      const ignoreBranch = matchCurrentColor;
      currentRun.left.equals(0).or(ignoreBranch).assertTrue();

      streakIndex = Circuit.if(
        isNoColor.or(ignoreBranch),
        streakIndex,
        streakIndex.add(1)
      );
      const adjustedIndex = Circuit.if(
        streakIndex.lt(0),
        Field(0),
        streakIndex
      );
      const nextStreak = streaks.get(adjustedIndex);

      // either it's a no color, or the 1st color of the next streak
      isNoColor
        .or(row[j].equals(nextStreak.color))
        .or(ignoreBranch)
        .assertTrue();

      const match = [
        ignoreBranch,
        ignoreBranch.not().and(isNoColor),
        ignoreBranch.not().and(isNoColor.not()),
      ];
      currentRun = {
        color: Circuit.switch(match, Color, [
          currentRun.color,
          noColor,
          nextStreak.color,
        ]),
        left: Circuit.switch(match, Color, [
          currentRun.left,
          Field(0),
          nextStreak.length.sub(1),
        ]),
      };
    }
  }
  // either we've seen all constraints, or there weren't any to begin with
  // note: this works on empty streaks because streakIndex is initialized as -1
  Field(streakIndex).equals(streaks.length.sub(1)).assertTrue();
  currentRun.left.equals(0).assertTrue();
}

/**
 * Here is a JS implementation of the above circuit in case it helps with readability
 */
// function checkRowJS(row: Color[], noColor: Color, streaks: ColoredStreak[]) {
//   let streakIndex = -1;
//   let currentRun = {
//     color: noColor,
//     left: 0,
//   };
//   for (let j = 0; j < gameInfo.columns.length; j++) {
//     if (row[j].equals(currentRun.color)) {
//       if (currentRun.color.equals(noColor)) {
//         continue;
//       }
//       if (currentRun.left <= 0) {
//         throw new Error('error');
//       }
//       currentRun.left--;
//     } else {
//       if (currentRun.left !== 0) {
//         throw new Error('error');
//       }
//       if (row[j].equals(noColor)) {
//         currentRun = {
//           color: noColor,
//           left: 0,
//         };
//       } else {
//         streakIndex++;
//         let expectedStreak = streaks[streakIndex];
//         if (!row[j].equals(expectedStreak.color)) {
//           throw new Error('error');
//         }
//         currentRun = {
//           color: expectedStreak.color,
//           left: Number(expectedStreak.length.toBigInt()) - 1,
//         };
//       }
//     }
//   }
//   if (streakIndex !== streaks.length - 1) {
//     throw new Error('error');
//   }
//   if (currentRun.left !== 0) {
//     throw new Error('error');
//   }
// }

const expectedHash = SolutionNonogram.fromJS(circuitGameInfo).hash();
console.log(`Generating zkApp for hash ${expectedHash.toBigInt()}`);

export class NewNonogramZkApp extends SmartContract {
  @state(Field) nonogramHash = State<Field>();

  init() {
    super.init();
    this.nonogramHash.set(Field(expectedHash));
  }

  /**
   * Note: We don't check if the user has already solved a specific puzzle
   *       It's up to the frontend to check if the puzzle is already solved by the user
   */
  @method submitSolution(
    solutionInstance: NonogramSubmission,
    streaks: SolutionNonogram
  ) {
    const noColor = Color.noColor();
    const solutionValue = solutionInstance.value;

    // get contract puzzle hash
    let nonogramHash = this.nonogramHash.get();
    this.nonogramHash.assertEquals(nonogramHash);

    // check streaks hash
    streaks
      .hash()
      .assertEquals(
        nonogramHash,
        'streaks do not match the on-chain committed streaks for this nonogram'
      );

    const emptyRow = new RowClass([{ color: noColor, length: Field(1) }]);
    const emptyColumn = new ColumnClass([{ color: noColor, length: Field(1) }]);
    // check row streaks
    for (let i = 0; i < gameInfo.rows.length; i++) {
      const adjustedStreaks = Circuit.if(
        streaks.rows[i].length.equals(0),
        emptyRow,
        streaks.rows[i] as InstanceType<typeof RowClass>
      );
      checkRowCircuit(solutionValue[i], noColor, adjustedStreaks);
    }

    // check column streaks
    {
      const column = Array.from(
        { length: gameInfo.rows.length },
        (_) => new Color(0)
      );
      for (let i = 0; i < gameInfo.columns.length; i++) {
        for (let j = 0; j < gameInfo.rows.length; j++) {
          column[j] = solutionValue[j][i];
        }
        const adjustedStreaks = Circuit.if(
          streaks.columns[i].length.equals(0),
          emptyColumn,
          streaks.columns[i] as InstanceType<typeof ColumnClass>
        );
        checkRowCircuit(column, noColor, adjustedStreaks);
      }
    }
  }
}
