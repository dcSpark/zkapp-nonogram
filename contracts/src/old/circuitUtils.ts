import { Circuit, Field } from 'snarkyjs';
import { Color } from '../common/types.js';
import { circuitGameInfo, ColumnClass, RowClass } from '../common/ioTypes.js';

function encodeAsStreak(
  row: Color[],
  result: InstanceType<typeof RowClass> | InstanceType<typeof ColumnClass>,
  noColor: Color
): void {
  // if the row starts with no color
  // we need to skip adding this to the result
  // this isn't easy, since we can't do an if set for adding to the circuit
  // so instead, if the row starts with noColor, we stuff it into the beginning of the array
  // and override it or delete it later

  let currentRun = {
    color: row[0],
    length: Field(1), // start with 1 just to make the math work
  };
  result.incrementLength(Field(1));
  result.set(Field(0), currentRun);
  let index = Circuit.if(row[0].equals(noColor), Field(-1), Field(0));

  for (let i = 1; i < row.length; i++) {
    const isNoColor = row[i].equals(noColor);
    const isPreviousColor = row[i].equals(row[i - 1]);
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

    result.incrementLength(
      Circuit.if(
        // if index<0, we want to skip the first incrementLength call
        startNewColor.and(index.gte(0)),
        Field(1),
        Field(0)
      )
    );
    index = Circuit.if(startNewColor, index.add(1), index);

    result.set(Circuit.if(index.lt(0), Field(0), index), currentRun);
  }

  // if we never ended up adding any color, then index == -1
  // with just the (non-overridden) starting value that we need to remove
  result.pop(Circuit.if(index.lt(0), Field(1), Field(0)));
}

const maxLengths = {
  row: Math.max(...circuitGameInfo.rows.map((row) => row.length)),
  column: Math.max(...circuitGameInfo.columns.map((column) => column.length)),
};
export function solutionRows(image: Color[][], noColor: Color): any {
  const result: (InstanceType<typeof RowClass> | [])[] = Array.from(
    { length: maxLengths.row },
    () => []
  );
  for (let i = 0; i < maxLengths.row; i++) {
    const streakResult = new RowClass();
    encodeAsStreak(image[i], streakResult, noColor);
    result[i] = streakResult;
  }

  return result;
}

export function solutionColumns(image: Color[][], noColor: Color): any {
  const result: (InstanceType<typeof ColumnClass> | [])[] = Array.from(
    { length: maxLengths.column },
    () => []
  );

  const column = Array.from({ length: maxLengths.row }, (_) => new Color(0));
  for (let i = 0; i < maxLengths.column; i++) {
    for (let j = 0; j < maxLengths.row; j++) {
      column[j] = image[j][i];
    }
    const streakResult = new ColumnClass();
    encodeAsStreak(column, streakResult, noColor);
    result[i] = streakResult;
  }

  return result;
}
