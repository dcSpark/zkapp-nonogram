import React from 'react';
import { DimensionsChoices } from '../common/constants';

export type DimensionType = {
  rows: number;
  cols: number;
};

/**
 * Produces a dropdown selection box for user to select the dimensions
 * of the game board when it's reset next.
 *
 * These choices are pulled from ../common/constants.ts.
 */
export function DimensionChoices() {
  const choices: React.ReactElement[] = [];

  for (let i = 0; i < DimensionsChoices.length; i++) {
    choices.push(<option>{DimensionsChoices[i][0] + 'x' + DimensionsChoices[i][1]}</option>);
  }

  return <select id="dimensions-select">{choices}</select>;
}
