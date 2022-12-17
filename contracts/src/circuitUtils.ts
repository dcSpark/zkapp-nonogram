import { Circuit, Field } from 'snarkyjs';
import { Color } from './types.js';
import { ColumnClass, RowClass, secretNonogram } from './solutionNonogram.js';

function encodeAsStreak(
  row: Color[],
  result: InstanceType<typeof RowClass> | InstanceType<typeof ColumnClass>
): void {
  let index = Field(0);
  let currentRun = {
    color: Color.noColor(),
    length: Field(1), // start with 1 just to make the math work
  };

  for (let i = 0; i < row.length; i++) {
    const isNoColor = row[i].equals(Color.noColor());
    const isPreviousColor = row[i].equals(currentRun.color);
    const extendPrevious = isNoColor.not().and(isPreviousColor);
    const startNewColor = isNoColor.not().and(isPreviousColor.not());
    const length = Circuit.switch(
      [isNoColor, extendPrevious, startNewColor],
      Field,
      [currentRun.length, currentRun.length.add(1), Field(1)]
    );

    const incrementSize = Circuit.if(startNewColor, Field(1), Field(0));
    result.incrementLength(incrementSize);

    // note: length is 0 for the initial noColor call, so this is a no-op in that case
    result.set(index, {
      color: currentRun.color,
      length,
    });

    index = Circuit.if(startNewColor, index.add(1), index);
  }
}

export function solutionRows(image: Color[][]): any {
  const result: (InstanceType<typeof RowClass> | [])[] = Array.from(
    { length: secretNonogram.rows.length },
    () => []
  );
  for (let i = 0; i < secretNonogram.rows.length; i++) {
    const streakResult = new RowClass();
    encodeAsStreak(image[i], streakResult);
    result[i] = streakResult;
  }

  return result;
}
export function solutionColumns(image: Color[][]): any {
  const result: (InstanceType<typeof ColumnClass> | [])[] = Array.from(
    { length: secretNonogram.columns.length },
    () => []
  );

  // note: safe to access thanks to sanity check
  for (let i = 0; i < secretNonogram.columns.length; i++) {
    const column = image.map((row) => row[i]);
    const streakResult = new ColumnClass();
    encodeAsStreak(column, streakResult);
    result[i] = streakResult;
  }

  return result;
}
