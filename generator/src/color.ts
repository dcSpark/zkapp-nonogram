/** A JS version of the types we need for our circuit */

export type Color = bigint;
export class ColorUtils {
  // Field(-1) in snarkyJS
  static NO_COLOR: Color = -1n;
}

export type ColoredStreak = {
  color: Color;
  length: number;
};
