import React from 'react';
import { Color } from '../common/constants';
import chroma from 'chroma-js';

/** ex: 3 1 3 */
export type StreakList = Streak[];

/**
 * A basic class containing the structure that makes up the hint
 * number values.
 */
export class BoardStreaks {
  rows: StreakList[];
  cols: StreakList[];

  constructor(rows: StreakList[], cols: StreakList[]) {
    this.rows = rows;
    this.cols = cols;
  }

  maxColor(): number {
    let maxColor = 1;
    for (const row of this.rows) {
      for (const num of row) {
        maxColor = Math.max(num.color, maxColor);
      }
    }
    for (const row of this.cols) {
      for (const num of row) {
        maxColor = Math.max(num.color, maxColor);
      }
    }
    return maxColor;
  }
}

export type Streak = {
  length: number;
  color: Color;
};
export function compareStreak(s1: Streak, s2: Streak): boolean {
  if (s1.length !== s2.length) return false;
  if (s1.color !== s2.color) return false;
  return true;
}

function adjustColor(color: string, targetContrast: number): string {
  const gameBackgroundColor = '#282c34';

  let finalColor = color;

  while (chroma.contrast(gameBackgroundColor, finalColor) >= targetContrast) {
    finalColor = chroma(finalColor).darken(0.1).hex();
  }
  while (chroma.contrast(gameBackgroundColor, finalColor) <= targetContrast) {
    finalColor = chroma(finalColor).brighten(0.1).hex();
  }

  return finalColor;
}

function StreakElement(props: {
  crossOut: boolean;
  streak: Streak;
  genColor: (index: number) => string;
}) {
  // repeatedly brighten color until the contrast is good enough
  const incompleteColor = adjustColor(props.genColor(props.streak.color), 4.5);

  // repeatedly darken color as long as contrast is good enough
  const completeColor = adjustColor(props.genColor(props.streak.color), 1.5);

  return (
    <div
      className={'hint'}
      style={{
        color: props.crossOut ? completeColor : incompleteColor,
      }}
    >
      {props.streak.length}
    </div>
  );
}

function StreakListElement(props: {
  genColor: (index: number) => string;
  /** the streak the user has actually drawn on the board */
  currentStreaks: StreakList;
  /** the expected streak for the solution */
  expectedStreaks: StreakList;
  /* place the list is rendered in */
  type: 'row' | 'col';
  emptyStreakColor: string;
}) {
  const streaks: React.ReactElement[] = [];

  // we have to find the overlap between the expected streaks and what the user has drawn
  // the way we do this is to iterate over the expected streaks (left to right)
  // and match based off of these

  // we want to avoid double-matching on the same streak
  // ex: if the hints are 3 1
  // and the user has drawn xxx
  // we don't want the same xxx to match the 3 and then the first x is reused to match the 1
  let lastMatchedStreak = 0;
  for (const expectedStreak of props.expectedStreaks) {
    let foundMatch = false;
    for (let i = lastMatchedStreak; i < props.currentStreaks.length; i++) {
      if (compareStreak(expectedStreak, props.currentStreaks[i])) {
        // start from next streak going forward to avoid the double-matching mentioned above
        lastMatchedStreak = i + 1;
        foundMatch = true;
        break;
      }
    }

    streaks.push(
      <StreakElement genColor={props.genColor} crossOut={foundMatch} streak={expectedStreak} />
    );
  }

  if (streaks.length === 0) {
    streaks.push(
      <StreakElement
        genColor={() => props.emptyStreakColor}
        crossOut={false}
        streak={{
          color: 0,
          length: 0,
        }}
      />
    );
  }
  return <div className={'hint-' + props.type}>{streaks}</div>;
}

type StreakSectionProps = {
  genColor: (index: number) => string;
  currentStreaks: StreakList[];
  expectedStreaks: StreakList[];
  type: 'row' | 'col';
  emptyStreakColor: string;
};

/**
 * Translates either row or column streaks into HTML div elements.
 *
 * The current streaks according to the current state of the board
 * are compared to the static goal streaks in order to "cross out" some numbers
 * in order to assist the user in figuring out what streak they've already finished.
 *
 * Crossed out hint numbers appear as a different color than normal hint numbers,
 * and are thus given a different div className than normal hint numbers.
 */
export const StreakSection = React.forwardRef<HTMLDivElement, StreakSectionProps>((props, ref) => {
  const streakLists: React.ReactElement[] = [];

  // this may happen if the board isn't available yet
  if (props.expectedStreaks.length === 0) {
    return <></>;
  }
  if (props.expectedStreaks.length !== props.currentStreaks.length) {
    throw new Error(
      `Unexpected: should never happen. Expect ${props.expectedStreaks.length}. Current ${props.currentStreaks.length}`
    );
  }
  for (let i = 0; i < props.expectedStreaks.length; i++) {
    streakLists.push(
      <StreakListElement
        genColor={props.genColor}
        currentStreaks={props.currentStreaks[i]}
        expectedStreaks={props.expectedStreaks[i]}
        type={props.type}
        emptyStreakColor={props.emptyStreakColor}
      />
    );
  }

  return (
    <div ref={ref} className={props.type + '-hints'}>
      {streakLists}
    </div>
  );
});
