import { Color } from './types';

/**
 * ======================================================
 *      We use 1-letter variable names in this file
 *     to make the ASCII in the array easier to read
 * ======================================================
 */

export function genSecretSolution() {
  // colors
  const C = {
    /** red */
    R: Color.hexToFields('FF0000'),
    /** green */
    G: Color.hexToFields('00FF00'),
    /** blue */
    B: Color.hexToFields('0000FF'),
    /** no color */
    N: Color.noColor(),
  };

  // prettier-ignore
  return {
    allRed:       [C.R, C.R],
    emptyThenRed: [C.N, C.R],
    allEmpty:     [C.N, C.N],
    emptyRedGreen:[C.N, C.R, C.G],
    redGreen:     [C.R, C.G],
  };
}
