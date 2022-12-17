import { Circuit, Field, Struct } from 'snarkyjs';
import { Color } from './types.js';
import { ColumnClass, RowClass, secretNonogram } from './solutionNonogram.js';

function encodeAsStreak(
  row: Color[],
  result: InstanceType<typeof RowClass> | InstanceType<typeof ColumnClass>
): void {
  let index = Field(-1);
  let currentRun = {
    color: Color.noColor(),
    length: Field(1), // start with 1 just to make the math work
  };

  // if the row starts with no color
  // we need to skip adding this to the result
  // this isn't easy, since we can't do an if set for adding to the circuit
  // so instead, if the row starts with noColor, we stuff it into the beginning of the array
  // and override it or delete it later
  let startOffset = Circuit.if(
    row[0].equals(Color.noColor()),
    Field(1),
    Field(0)
  );
  result.incrementLength(startOffset);

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
    // avoid result.set overriding the last seen color if there are no colors afterwards
    const color = Circuit.if(isNoColor, currentRun.color, row[i]);
    currentRun = {
      color: color,
      length,
    };

    // if startOffset is true, we want to skip the first incrementLength call
    const incrementLength = Circuit.if(
      startOffset.equals(1).or(startNewColor.not()),
      Field(0),
      Field(1)
    );
    result.incrementLength(incrementLength);

    index = Circuit.if(startNewColor, index.add(1), index);
    // <0 in the case that we had some empty colors at the start of the array
    const adjustedIndex = Circuit.if(index.lt(0), Field(0), index);
    // remove the start offset after it's been used up
    startOffset = Field(0);

    result.set(adjustedIndex, currentRun);
  }

  // if we never ended up adding any color, then the length is === 1
  // with just the (non-overridden) start offset, so we need to remove it
  result.pop(startOffset);
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

  const column = Array.from(
    { length: secretNonogram.rows.length },
    (_) => new Color(0)
  );
  for (let i = 0; i < secretNonogram.columns.length; i++) {
    for (let j = 0; j < secretNonogram.rows.length; j++) {
      column[j] = image[j][i];
    }
    const streakResult = new ColumnClass();
    encodeAsStreak(column, streakResult);
    result[i] = streakResult;
  }

  return result;
}
