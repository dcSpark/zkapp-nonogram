import { ColorUtils, ColoredStreak, Color } from "./color";

/**
 * Pure JS implementation of Nonogram generator
 * See circuitUtils for the Circuit version
 */

function sanityCheck(image: Color[][]) {
  // 1) Make sure both |row| and |column| >= 1
  if (image.length === 0) {
    throw new Error("Image cannot be empty");
  }
  const firstRowLength = image[0].length;
  if (firstRowLength === 0) {
    throw new Error("Image cannot be empty");
  }

  // 2) Make sure all rows are the same length
  for (const row of image) {
    if (row.length !== firstRowLength) {
      throw new Error(
        `Unexpected row length. Expected ${firstRowLength}, found ${row.length}. All rows should be the same length`
      );
    }
  }
}
function encodeAsStreak(row: Color[]): ColoredStreak[] {
  const result: ColoredStreak[] = [];
  let currentRun = {
    color: ColorUtils.NO_COLOR,
    length: 0,
  };

  const maybeAddRun = () => {
    if (currentRun.color !== ColorUtils.NO_COLOR) {
      result.push({
        color: currentRun.color,
        length: currentRun.length,
      });
    }
  };
  for (const entry of row) {
    if (entry === currentRun.color) {
      currentRun.length++;
      continue;
    }
    maybeAddRun();
    currentRun = {
      color: entry,
      length: 1,
    };
  }
  maybeAddRun();

  return result;
}

export function solutionRows(image: Color[][]): ColoredStreak[][] {
  const result: ColoredStreak[][] = [];
  for (const row of image) {
    result.push(encodeAsStreak(row));
  }

  return result;
}
export function solutionColumns(image: Color[][]): ColoredStreak[][] {
  sanityCheck(image);

  const result: ColoredStreak[][] = [];

  // note: safe to access thanks to sanity check
  const firstRowLength = image[0].length;
  for (let i = 0; i < firstRowLength; i++) {
    const column = image.map((row) => row[i]);
    result.push(encodeAsStreak(column));
  }

  return result;
}
