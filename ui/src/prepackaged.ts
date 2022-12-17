import { ColorGenerator } from './components/game/Board';
import { DimensionType } from './components/game/Dimension';
import { BoardStreaks } from './components/game/Streaks';

export type BoardDescription = {
  dimensions: DimensionType;
  expectedStreaks: BoardStreaks;
  colorGenerator: ColorGenerator;
  defaultColor: string;
};

export function smallRandom(): BoardDescription {
  return {
    defaultColor: '#888888',
    dimensions: {
      rows: 5,
      cols: 10,
    },
    expectedStreaks: new BoardStreaks(
      [
        [
          {
            color: 1,
            length: 1,
          },
          {
            color: 1,
            length: 1,
          },
          {
            color: 1,
            length: 2,
          },
          {
            color: 0,
            length: 2,
          },
        ],
        [
          {
            color: 1,
            length: 1,
          },
          {
            color: 0,
            length: 1,
          },
          {
            color: 1,
            length: 1,
          },
          {
            color: 1,
            length: 1,
          },
        ],
        [
          {
            color: 1,
            length: 1,
          },
        ],
        [
          {
            color: 1,
            length: 2,
          },
          {
            color: 0,
            length: 2,
          },
          {
            color: 1,
            length: 1,
          },
          {
            color: 1,
            length: 1,
          },
        ],
        [
          {
            color: 1,
            length: 1,
          },
          {
            color: 0,
            length: 1,
          },
          {
            color: 1,
            length: 1,
          },
          {
            color: 0,
            length: 2,
          },
        ],
      ],
      [
        [
          {
            color: 1,
            length: 1,
          },
          {
            color: 1,
            length: 2,
          },
        ],
        [
          {
            color: 1,
            length: 1,
          },
        ],
        [
          {
            color: 1,
            length: 2,
          },
          {
            color: 0,
            length: 1,
          },
          {
            color: 1,
            length: 1,
          },
        ],
        [
          {
            color: 0,
            length: 1,
          },
          {
            color: 0,
            length: 2,
          },
        ],
        [
          {
            color: 1,
            length: 1,
          },
        ],
        [
          {
            color: 1,
            length: 2,
          },
        ],
        [
          {
            color: 1,
            length: 2,
          },
        ],
        [
          {
            color: 0,
            length: 1,
          },
        ],
        [
          {
            color: 0,
            length: 1,
          },
          {
            color: 0,
            length: 1,
          },
        ],
        [
          {
            color: 1,
            length: 1,
          },
          {
            color: 1,
            length: 1,
          },
          {
            color: 0,
            length: 1,
          },
        ],
      ]
    ),
    colorGenerator: (_numColor, index) => {
      switch (index) {
        case 0:
          return '#022E41'; // 142913
        case 1:
          return '#FC951F'; // 16553247
        default: {
          throw new Error(`Unexpected color index ${index}`);
        }
      }
    },
  };
}

export function dcSparkSmall(): BoardDescription {
  return {
    defaultColor: '#222222',
    dimensions: {
      rows: 14,
      cols: 16,
    },
    expectedStreaks: new BoardStreaks(
      [
        [
          {
            color: 0,
            length: 11,
          },
        ],
        [
          {
            color: 0,
            length: 13,
          },
        ],
        [
          {
            color: 0,
            length: 14,
          },
        ],
        [
          {
            color: 0,
            length: 7,
          },
          {
            color: 1,
            length: 2,
          },
          {
            color: 0,
            length: 7,
          },
        ],
        [
          {
            color: 0,
            length: 7,
          },
          {
            color: 1,
            length: 2,
          },
          {
            color: 0,
            length: 7,
          },
        ],
        [
          {
            color: 0,
            length: 3,
          },
          {
            color: 1,
            length: 3,
          },
          {
            color: 0,
            length: 1,
          },
          {
            color: 1,
            length: 2,
          },
          {
            color: 0,
            length: 1,
          },
          {
            color: 2,
            length: 3,
          },
          {
            color: 0,
            length: 3,
          },
        ],
        [
          {
            color: 0,
            length: 3,
          },
          {
            color: 1,
            length: 6,
          },
          {
            color: 2,
            length: 4,
          },
          {
            color: 0,
            length: 3,
          },
        ],
        [
          {
            color: 0,
            length: 5,
          },
          {
            color: 1,
            length: 4,
          },
          {
            color: 2,
            length: 2,
          },
          {
            color: 0,
            length: 5,
          },
        ],
        [
          {
            color: 0,
            length: 4,
          },
          {
            color: 1,
            length: 5,
          },
          {
            color: 2,
            length: 3,
          },
          {
            color: 0,
            length: 4,
          },
        ],
        [
          {
            color: 0,
            length: 3,
          },
          {
            color: 1,
            length: 3,
          },
          {
            color: 0,
            length: 4,
          },
          {
            color: 2,
            length: 3,
          },
          {
            color: 0,
            length: 3,
          },
        ],
        [
          {
            color: 0,
            length: 16,
          },
        ],
        [
          {
            color: 0,
            length: 14,
          },
        ],
        [
          {
            color: 0,
            length: 13,
          },
        ],
        [
          {
            color: 0,
            length: 11,
          },
        ],
      ],
      [
        [
          {
            color: 0,
            length: 8,
          },
        ],
        [
          {
            color: 0,
            length: 12,
          },
        ],
        [
          {
            color: 0,
            length: 14,
          },
        ],
        [
          {
            color: 0,
            length: 5,
          },
          {
            color: 1,
            length: 2,
          },
          {
            color: 0,
            length: 2,
          },
          {
            color: 1,
            length: 1,
          },
          {
            color: 0,
            length: 4,
          },
        ],
        [
          {
            color: 0,
            length: 5,
          },
          {
            color: 1,
            length: 2,
          },
          {
            color: 0,
            length: 1,
          },
          {
            color: 1,
            length: 2,
          },
          {
            color: 0,
            length: 4,
          },
        ],
        [
          {
            color: 0,
            length: 5,
          },
          {
            color: 1,
            length: 5,
          },
          {
            color: 0,
            length: 4,
          },
        ],
        [
          {
            color: 0,
            length: 6,
          },
          {
            color: 1,
            length: 3,
          },
          {
            color: 0,
            length: 5,
          },
        ],
        [
          {
            color: 0,
            length: 3,
          },
          {
            color: 1,
            length: 6,
          },
          {
            color: 0,
            length: 5,
          },
        ],
        [
          {
            color: 0,
            length: 3,
          },
          {
            color: 1,
            length: 6,
          },
          {
            color: 0,
            length: 5,
          },
        ],
        [
          {
            color: 0,
            length: 6,
          },
          {
            color: 2,
            length: 3,
          },
          {
            color: 0,
            length: 5,
          },
        ],
        [
          {
            color: 0,
            length: 5,
          },
          {
            color: 2,
            length: 5,
          },
          {
            color: 0,
            length: 4,
          },
        ],
        [
          {
            color: 0,
            length: 5,
          },
          {
            color: 2,
            length: 2,
          },
          {
            color: 0,
            length: 1,
          },
          {
            color: 2,
            length: 2,
          },
          {
            color: 0,
            length: 4,
          },
        ],
        [
          {
            color: 0,
            length: 5,
          },
          {
            color: 2,
            length: 2,
          },
          {
            color: 0,
            length: 2,
          },
          {
            color: 2,
            length: 1,
          },
          {
            color: 0,
            length: 4,
          },
        ],
        [
          {
            color: 0,
            length: 12,
          },
        ],
        [
          {
            color: 0,
            length: 10,
          },
        ],
        [
          {
            color: 0,
            length: 8,
          },
        ],
      ]
    ),
    colorGenerator: (_numColor, index) => {
      switch (index) {
        case 0:
          return '#F6F3EB'; // 16184299
        case 1:
          return '#022E41'; // 142913
        case 2:
          return '#FC951F'; // 16553247
        default: {
          throw new Error(`Unexpected color index ${index}`);
        }
      }
    },
  };
}

export function dcSparkFull(): BoardDescription {
  return {
    defaultColor: '#222222',
    dimensions: {
      rows: 16,
      cols: 38,
    },
    expectedStreaks: new BoardStreaks(
      [
        [
          { color: 0, length: 8 },
          { color: 1, length: 5 },
          { color: 2, length: 4 },
        ],
        [
          { color: 0, length: 11 },
          { color: 1, length: 4 },
          { color: 2, length: 7 },
        ],
        [
          { color: 0, length: 13 },
          { color: 1, length: 2 },
          { color: 0, length: 1 },
          { color: 1, length: 1 },
          { color: 2, length: 6 },
          { color: 0, length: 1 },
          { color: 2, length: 2 },
        ],
        [
          { color: 0, length: 14 },
          { color: 1, length: 2 },
          { color: 0, length: 1 },
          { color: 2, length: 1 },
          { color: 0, length: 1 },
          { color: 2, length: 5 },
          { color: 0, length: 1 },
          { color: 2, length: 1 },
          { color: 0, length: 1 },
          { color: 2, length: 2 },
        ],
        [
          { color: 0, length: 7 },
          { color: 3, length: 2 },
          { color: 0, length: 7 },
          { color: 1, length: 2 },
          { color: 0, length: 3 },
          { color: 2, length: 5 },
          { color: 0, length: 3 },
          { color: 2, length: 2 },
          { color: 4, length: 1 },
        ],
        [
          { color: 0, length: 7 },
          { color: 3, length: 2 },
          { color: 0, length: 6 },
          { color: 5, length: 2 },
          { color: 5, length: 2 },
          { color: 1, length: 1 },
          { color: 2, length: 1 },
          { color: 0, length: 1 },
          { color: 2, length: 1 },
          { color: 0, length: 1 },
          { color: 2, length: 5 },
          { color: 0, length: 1 },
          { color: 2, length: 1 },
          { color: 0, length: 1 },
          { color: 2, length: 2 },
          { color: 4, length: 1 },
        ],
        [
          { color: 0, length: 4 },
          { color: 3, length: 3 },
          { color: 0, length: 1 },
          { color: 3, length: 2 },
          { color: 0, length: 1 },
          { color: 6, length: 3 },
          { color: 0, length: 1 },
          { color: 5, length: 8 },
          { color: 2, length: 1 },
          { color: 0, length: 1 },
          { color: 2, length: 2 },
          { color: 0, length: 1 },
          { color: 2, length: 3 },
          { color: 0, length: 1 },
          { color: 2, length: 2 },
          { color: 0, length: 1 },
          { color: 2, length: 1 },
          { color: 4, length: 2 },
        ],
        [
          { color: 0, length: 4 },
          { color: 3, length: 6 },
          { color: 6, length: 4 },
          { color: 5, length: 10 },
          { color: 0, length: 1 },
          { color: 2, length: 2 },
          { color: 0, length: 1 },
          { color: 2, length: 3 },
          { color: 0, length: 1 },
          { color: 2, length: 2 },
          { color: 0, length: 1 },
          { color: 4, length: 3 },
        ],
        [
          { color: 0, length: 6 },
          { color: 3, length: 4 },
          { color: 6, length: 2 },
          { color: 0, length: 2 },
          { color: 5, length: 10 },
          { color: 0, length: 1 },
          { color: 2, length: 2 },
          { color: 0, length: 1 },
          { color: 2, length: 3 },
          { color: 0, length: 1 },
          { color: 2, length: 1 },
          { color: 4, length: 1 },
          { color: 0, length: 1 },
          { color: 4, length: 3 },
        ],
        [
          { color: 0, length: 5 },
          { color: 3, length: 5 },
          { color: 6, length: 3 },
          { color: 0, length: 1 },
          { color: 5, length: 10 },
          { color: 0, length: 1 },
          { color: 2, length: 2 },
          { color: 0, length: 1 },
          { color: 2, length: 3 },
          { color: 0, length: 1 },
          { color: 4, length: 2 },
          { color: 0, length: 1 },
          { color: 4, length: 3 },
        ],
        [
          { color: 0, length: 3 },
          { color: 3, length: 3 },
          { color: 0, length: 4 },
          { color: 6, length: 3 },
          { color: 0, length: 1 },
          { color: 5, length: 8 },
          { color: 2, length: 1 },
          { color: 0, length: 1 },
          { color: 2, length: 3 },
          { color: 0, length: 1 },
          { color: 2, length: 1 },
          { color: 0, length: 1 },
          { color: 4, length: 3 },
          { color: 0, length: 1 },
          { color: 4, length: 3 },
        ],
        [
          { color: 0, length: 15 },
          { color: 5, length: 6 },
          { color: 2, length: 2 },
          { color: 0, length: 1 },
          { color: 2, length: 3 },
          { color: 0, length: 3 },
          { color: 4, length: 3 },
          { color: 0, length: 1 },
          { color: 4, length: 2 },
        ],
        [
          { color: 0, length: 14 },
          { color: 5, length: 4 },
          { color: 2, length: 2 },
          { color: 0, length: 1 },
          { color: 2, length: 2 },
          { color: 4, length: 1 },
          { color: 0, length: 1 },
          { color: 4, length: 1 },
          { color: 0, length: 1 },
          { color: 4, length: 3 },
          { color: 0, length: 1 },
          { color: 4, length: 2 },
        ],
        [
          { color: 0, length: 13 },
          { color: 5, length: 2 },
          { color: 2, length: 3 },
          { color: 4, length: 3 },
          { color: 0, length: 1 },
          { color: 4, length: 6 },
        ],
        [
          { color: 0, length: 11 },
          { color: 4, length: 11 },
        ],
        [
          { color: 0, length: 8 },
          { color: 4, length: 8 },
        ],
      ],
      [
        [{ color: 0, length: 4 }],
        [{ color: 0, length: 8 }],
        [{ color: 0, length: 12 }],
        [{ color: 0, length: 14 }],
        [
          { color: 0, length: 5 },
          { color: 3, length: 2 },
          { color: 0, length: 2 },
          { color: 3, length: 1 },
          { color: 0, length: 4 },
        ],
        [
          { color: 0, length: 6 },
          { color: 3, length: 2 },
          { color: 0, length: 1 },
          { color: 3, length: 2 },
          { color: 0, length: 5 },
        ],
        [
          { color: 0, length: 6 },
          { color: 3, length: 5 },
          { color: 0, length: 5 },
        ],
        [
          { color: 0, length: 7 },
          { color: 3, length: 3 },
          { color: 0, length: 6 },
        ],
        [
          { color: 0, length: 4 },
          { color: 3, length: 6 },
          { color: 0, length: 6 },
        ],
        [
          { color: 0, length: 4 },
          { color: 3, length: 6 },
          { color: 0, length: 6 },
        ],
        [
          { color: 0, length: 7 },
          { color: 6, length: 3 },
          { color: 0, length: 6 },
        ],
        [
          { color: 0, length: 6 },
          { color: 6, length: 5 },
          { color: 0, length: 5 },
        ],
        [
          { color: 0, length: 6 },
          { color: 6, length: 2 },
          { color: 0, length: 1 },
          { color: 6, length: 2 },
          { color: 0, length: 5 },
        ],
        [
          { color: 0, length: 5 },
          { color: 6, length: 2 },
          { color: 0, length: 2 },
          { color: 6, length: 1 },
          { color: 0, length: 4 },
        ],
        [
          { color: 0, length: 5 },
          { color: 5, length: 3 },
          { color: 0, length: 4 },
        ],
        [
          { color: 0, length: 3 },
          { color: 5, length: 5 },
          { color: 0, length: 2 },
        ],
        [
          { color: 0, length: 1 },
          { color: 5, length: 7 },
        ],
        [{ color: 5, length: 8 }],
        [{ color: 5, length: 8 }],
        [{ color: 5, length: 8 }],
        [{ color: 5, length: 8 }],
        [{ color: 5, length: 7 }],
        [
          { color: 1, length: 3 },
          { color: 5, length: 5 },
          { color: 2, length: 2 },
        ],
        [
          { color: 1, length: 3 },
          { color: 2, length: 2 },
          { color: 5, length: 3 },
          { color: 2, length: 4 },
        ],
        [
          { color: 1, length: 2 },
          { color: 0, length: 10 },
          { color: 2, length: 1 },
          { color: 4, length: 1 },
        ],
        [
          { color: 1, length: 2 },
          { color: 0, length: 1 },
          { color: 2, length: 1 },
          { color: 0, length: 1 },
          { color: 2, length: 9 },
          { color: 4, length: 1 },
        ],
        [
          { color: 1, length: 3 },
          { color: 0, length: 3 },
          { color: 2, length: 7 },
          { color: 4, length: 3 },
        ],
        [
          { color: 1, length: 2 },
          { color: 2, length: 4 },
          { color: 0, length: 4 },
          { color: 2, length: 2 },
          { color: 4, length: 4 },
        ],
        [
          { color: 1, length: 1 },
          { color: 2, length: 9 },
          { color: 0, length: 3 },
          { color: 4, length: 3 },
        ],
        [
          { color: 1, length: 1 },
          { color: 2, length: 10 },
          { color: 0, length: 1 },
          { color: 4, length: 1 },
          { color: 0, length: 1 },
          { color: 4, length: 2 },
        ],
        [
          { color: 2, length: 10 },
          { color: 0, length: 3 },
          { color: 4, length: 3 },
        ],
        [
          { color: 2, length: 6 },
          { color: 0, length: 4 },
          { color: 4, length: 6 },
        ],
        [
          { color: 2, length: 3 },
          { color: 0, length: 3 },
          { color: 2, length: 3 },
          { color: 4, length: 7 },
        ],
        [
          { color: 2, length: 2 },
          { color: 0, length: 1 },
          { color: 2, length: 1 },
          { color: 0, length: 1 },
          { color: 2, length: 3 },
          { color: 4, length: 8 },
        ],
        [
          { color: 2, length: 2 },
          { color: 0, length: 10 },
          { color: 4, length: 2 },
        ],
        [
          { color: 2, length: 5 },
          { color: 4, length: 7 },
        ],
        [
          { color: 2, length: 3 },
          { color: 4, length: 7 },
        ],
        [{ color: 4, length: 7 }],
      ]
    ),
    colorGenerator: (_numColor, index) => {
      switch (index) {
        case 0:
          return '#F6F3EB'; // 16184299
        case 1:
          return '#F0D0C4'; // 15782084
        case 2:
          return '#F19465'; // 15832165
        case 3:
          return '#022E41'; // 142913
        case 4:
          return '#AC76B3'; // 11302579
        case 5:
          return '#FF0000'; // 16711680
        case 6:
          return '#FC951F'; // 16553247
        default: {
          return '#000000';
          // TODO
          // throw new Error(`Unexpected color index ${index}`);
        }
      }
    },
  };
}
