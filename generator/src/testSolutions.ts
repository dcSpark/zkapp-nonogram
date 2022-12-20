import { Color } from './types';
import { isReady } from 'snarkyjs';

/**
 * ======================================================
 *      We use 1-letter variable names in this file
 *     to make the ASCII in the array easier to read
 * ======================================================
 */

export async function genSecretSolution() {
  await isReady;

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
    empty2ThenRed:[C.N, C.N, C.R],
    allEmpty:     [C.N, C.N],
    emptyRedGreen:[C.N, C.R, C.G],
    redGreen:     [C.R, C.G],
    RedEmptyRed:  [C.R, C.N, C.R],
    Red2EmptyRed: [C.R, C.N, C.N, C.R],
  };
}
