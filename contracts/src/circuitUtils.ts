import { Circuit, Field } from 'snarkyjs';
import { Color } from './types';
import { ColumnClass, RowClass, secretNonogram } from './solutionNonogram';

function encodeAsStreak(
  row: Color[],
  result: InstanceType<typeof RowClass> | InstanceType<typeof ColumnClass>
): void {
  let index = Field(0);
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

    const incrementSize = Circuit.if(startNewColor, Field(1), Field(0));
    // if startOffset is true, we want to skip the first incrementLength call
    const incrementLength = Circuit.if(
      startOffset.equals(1),
      Field(0),
      incrementSize
    );
    result.incrementLength(incrementLength);
    // remove the start offset after it's been used up
    startOffset = Circuit.if(
      startOffset.equals(1),
      startOffset.sub(incrementSize),
      startOffset
    );

    // note: length is 0 for the initial noColor call, so this is a no-op in that case
    // avoid result.set overriding the last seen color if there are no colors afterwards
    const color = Circuit.if(isNoColor, currentRun.color, row[i]);
    currentRun = {
      color: color,
      length,
    };
    result.set(index, currentRun);

    index = Circuit.if(startNewColor, index.add(incrementLength), index);
  }
  // if we never ended up adding any color, then the length is === 1
  // with just the start offset, so we need to remove it
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

  // note: safe to access thanks to sanity check
  for (let i = 0; i < secretNonogram.columns.length; i++) {
    const column = image.map((row) => row[i]);
    const streakResult = new ColumnClass();
    encodeAsStreak(column, streakResult);
    result[i] = streakResult;
  }

  return result;
}
