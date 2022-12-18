import {
  Field,
  SmartContract,
  method,
  state,
  State,
  isReady,
  Circuit,
  Bool,
} from 'snarkyjs';
import { secretNonogram, secretSolution } from '../common/solutionNonogram';
import {
  NonogramSubmission,
  SolutionNonogram,
  RowClass,
  ColumnClass,
} from '../common/ioTypes';
import { Color, ColoredStreak } from '../common/types';
import { solutionColumns, solutionRows } from '../common/jsUtils';

await isReady;

function checkRowCircuit(
  row: Color[],
  noColor: Color,
  streaks: ColoredStreak[]
) {
  let streakIndex = -1;
  let currentRun = {
    color: noColor,
    left: Field(0),
  };
  let isEmptyConstraint = Bool(true);
  for (let j = 0; j < row.length; j++) {
    const matchCurrentColor = row[j].equals(currentRun.color);
    const isNoColor = row[j].equals(noColor);
    isEmptyConstraint = Circuit.if(isNoColor, Bool(true), isEmptyConstraint);

    // matchCurrentColor = true
    {
      const ignoreBranch = matchCurrentColor.not();
      const lengthChange = Circuit.if(
        ignoreBranch.or(currentRun.color.equals(noColor)),
        Field(0),
        Field(1)
      );
      currentRun.left.gte(0).or(ignoreBranch);
      currentRun.left = currentRun.left.sub(lengthChange);
    }
    // matchCurrentColor = false
    {
      const ignoreBranch = matchCurrentColor;
      currentRun.left.equals(0).or(ignoreBranch).assertTrue();

      streakIndex = isNoColor.or(ignoreBranch).toBoolean()
        ? streakIndex
        : streakIndex + 1;
      // streakIndex = Number(
      //   Circuit.if(
      //     isNoColor.or(ignoreBranch),
      //     Field(streakIndex),
      //     Field(streakIndex + 1)
      //   ).toBigInt()
      // );
      // const adjustedIndex = Circuit.if(streakIndex < 0, 0, streakIndex);
      const adjustedIndex = streakIndex < 0 ? 0 : streakIndex;
      const nextStreak = streaks[adjustedIndex];

      // either it's a no color, or the 1st color of the next streak
      isNoColor
        .or(row[j].equals(nextStreak.color))
        .or(ignoreBranch)
        .assertTrue();

      currentRun = {
        color: Circuit.switch(
          [
            ignoreBranch,
            ignoreBranch.not().and(isNoColor),
            ignoreBranch.not().and(isNoColor.not()),
          ],
          Color,
          [currentRun.color, noColor, nextStreak.color]
        ),
        left: Circuit.switch(
          [
            ignoreBranch,
            ignoreBranch.not().and(isNoColor),
            ignoreBranch.not().and(isNoColor.not()),
          ],
          Color,
          [currentRun.left, Field(0), nextStreak.length.sub(1)]
        ),
      };
    }
  }
  // either we've seen all constraints, or there weren't any to begin with
  isEmptyConstraint
    .or(Field(streakIndex).equals(streaks.length - 1))
    .assertTrue();
  currentRun.left.equals(0).assertTrue();
}

// function checkRowJS(row: Color[], noColor: Color, streaks: ColoredStreak[]) {
//   let streakIndex = -1;
//   let currentRun = {
//     color: noColor,
//     left: 0,
//   };
//   for (let j = 0; j < secretNonogram.columns.length; j++) {
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

const expectedHash = SolutionNonogram.fromJS({
  rows: solutionRows(secretSolution),
  columns: solutionColumns(secretSolution),
}).hash();

export class NewNonogramZkApp extends SmartContract {
  @state(Field) nonogramHash = State<Field>();

  init() {
    super.init();
    this.nonogramHash.set(
      Field(
        expectedHash // - doesn't work when deploying (?) - needs to be a static constant
        // 27417915103099424883129587366510885725444441367370105474708385997982957530358n
      )
    );
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
    for (let i = 0; i < secretNonogram.rows.length; i++) {
      const adjustedStreaks = Circuit.if(
        streaks.rows[i].length.equals(0),
        emptyRow,
        streaks.rows[i]
      );
      checkRowCircuit(solutionValue[i], noColor, adjustedStreaks.values);
    }

    // check column streaks
    {
      const column = Array.from(
        { length: secretNonogram.rows.length },
        (_) => new Color(0)
      );
      for (let i = 0; i < secretNonogram.columns.length; i++) {
        for (let j = 0; j < secretNonogram.rows.length; j++) {
          column[j] = solutionValue[j][i];
        }
        const adjustedStreaks = Circuit.if(
          streaks.columns[i].length.equals(0),
          emptyColumn,
          streaks.columns[i]
        );
        checkRowCircuit(column, noColor, adjustedStreaks.values);
      }
    }
  }
}
