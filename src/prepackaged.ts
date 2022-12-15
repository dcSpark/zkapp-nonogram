import { ColorGenerator } from './components/game/Board';
import { DimensionType } from './components/game/Dimension';
import { BoardStreaks } from './components/game/Streaks';

export type BoardDescription = {
  dimensions: DimensionType;
  expectedStreaks: BoardStreaks;
  colorGenerator: ColorGenerator;
  defaultColor: string;
};
export function dcSpark(): BoardDescription {
  return {
    defaultColor: '#222222',
    dimensions: {
      rows: 18,
      cols: 40,
    },
    expectedStreaks: new BoardStreaks(
      [
        [],
        [
          {
            color: 0,
            length: 7,
          },
          {
            color: 1,
            length: 4,
          },
          {
            color: 2,
            length: 3,
          },
        ],
        [
          {
            color: 0,
            length: 10,
          },
          {
            color: 1,
            length: 3,
          },
          {
            color: 2,
            length: 6,
          },
        ],
        [
          {
            color: 0,
            length: 12,
          },
          {
            color: 1,
            length: 1,
          },
          {
            color: 3,
            length: 0,
          },
          {
            color: 1,
            length: 0,
          },
          {
            color: 2,
            length: 5,
          },
          {
            color: 3,
            length: 0,
          },
          {
            color: 2,
            length: 1,
          },
        ],
        [
          {
            color: 0,
            length: 13,
          },
          {
            color: 1,
            length: 1,
          },
          {
            color: 3,
            length: 0,
          },
          {
            color: 2,
            length: 0,
          },
          {
            color: 3,
            length: 0,
          },
          {
            color: 2,
            length: 4,
          },
          {
            color: 3,
            length: 0,
          },
          {
            color: 2,
            length: 0,
          },
          {
            color: 3,
            length: 0,
          },
          {
            color: 2,
            length: 1,
          },
        ],
        [
          {
            color: 0,
            length: 6,
          },
          {
            color: 4,
            length: 1,
          },
          {
            color: 0,
            length: 6,
          },
          {
            color: 1,
            length: 1,
          },
          {
            color: 3,
            length: 2,
          },
          {
            color: 2,
            length: 4,
          },
          {
            color: 3,
            length: 2,
          },
          {
            color: 2,
            length: 1,
          },
          {
            color: 5,
            length: 0,
          },
        ],
        [
          {
            color: 0,
            length: 6,
          },
          {
            color: 4,
            length: 1,
          },
          {
            color: 0,
            length: 5,
          },
          {
            color: 6,
            length: 1,
          },
          {
            color: 6,
            length: 1,
          },
          {
            color: 1,
            length: 0,
          },
          {
            color: 2,
            length: 0,
          },
          {
            color: 3,
            length: 0,
          },
          {
            color: 2,
            length: 0,
          },
          {
            color: 3,
            length: 0,
          },
          {
            color: 2,
            length: 4,
          },
          {
            color: 3,
            length: 0,
          },
          {
            color: 2,
            length: 0,
          },
          {
            color: 3,
            length: 0,
          },
          {
            color: 2,
            length: 1,
          },
          {
            color: 5,
            length: 0,
          },
        ],
        [
          {
            color: 0,
            length: 3,
          },
          {
            color: 4,
            length: 2,
          },
          {
            color: 0,
            length: 0,
          },
          {
            color: 4,
            length: 1,
          },
          {
            color: 0,
            length: 0,
          },
          {
            color: 7,
            length: 2,
          },
          {
            color: 0,
            length: 0,
          },
          {
            color: 6,
            length: 7,
          },
          {
            color: 2,
            length: 0,
          },
          {
            color: 3,
            length: 0,
          },
          {
            color: 2,
            length: 1,
          },
          {
            color: 3,
            length: 0,
          },
          {
            color: 2,
            length: 2,
          },
          {
            color: 3,
            length: 0,
          },
          {
            color: 2,
            length: 1,
          },
          {
            color: 3,
            length: 0,
          },
          {
            color: 2,
            length: 0,
          },
          {
            color: 5,
            length: 1,
          },
        ],
        [
          {
            color: 0,
            length: 3,
          },
          {
            color: 4,
            length: 5,
          },
          {
            color: 7,
            length: 3,
          },
          {
            color: 6,
            length: 9,
          },
          {
            color: 3,
            length: 0,
          },
          {
            color: 2,
            length: 1,
          },
          {
            color: 3,
            length: 0,
          },
          {
            color: 2,
            length: 2,
          },
          {
            color: 3,
            length: 0,
          },
          {
            color: 2,
            length: 1,
          },
          {
            color: 3,
            length: 0,
          },
          {
            color: 5,
            length: 2,
          },
        ],
        [
          {
            color: 0,
            length: 5,
          },
          {
            color: 4,
            length: 3,
          },
          {
            color: 7,
            length: 1,
          },
          {
            color: 0,
            length: 1,
          },
          {
            color: 6,
            length: 9,
          },
          {
            color: 3,
            length: 0,
          },
          {
            color: 2,
            length: 1,
          },
          {
            color: 3,
            length: 0,
          },
          {
            color: 2,
            length: 2,
          },
          {
            color: 3,
            length: 0,
          },
          {
            color: 2,
            length: 0,
          },
          {
            color: 5,
            length: 0,
          },
          {
            color: 3,
            length: 0,
          },
          {
            color: 5,
            length: 2,
          },
        ],
        [
          {
            color: 0,
            length: 4,
          },
          {
            color: 4,
            length: 4,
          },
          {
            color: 7,
            length: 2,
          },
          {
            color: 0,
            length: 0,
          },
          {
            color: 6,
            length: 9,
          },
          {
            color: 3,
            length: 0,
          },
          {
            color: 2,
            length: 1,
          },
          {
            color: 3,
            length: 0,
          },
          {
            color: 2,
            length: 2,
          },
          {
            color: 3,
            length: 0,
          },
          {
            color: 5,
            length: 1,
          },
          {
            color: 3,
            length: 0,
          },
          {
            color: 5,
            length: 2,
          },
        ],
        [
          {
            color: 0,
            length: 2,
          },
          {
            color: 4,
            length: 2,
          },
          {
            color: 0,
            length: 3,
          },
          {
            color: 7,
            length: 2,
          },
          {
            color: 0,
            length: 0,
          },
          {
            color: 6,
            length: 7,
          },
          {
            color: 2,
            length: 0,
          },
          {
            color: 3,
            length: 0,
          },
          {
            color: 2,
            length: 2,
          },
          {
            color: 3,
            length: 0,
          },
          {
            color: 2,
            length: 0,
          },
          {
            color: 3,
            length: 0,
          },
          {
            color: 5,
            length: 2,
          },
          {
            color: 3,
            length: 0,
          },
          {
            color: 5,
            length: 2,
          },
        ],
        [
          {
            color: 0,
            length: 14,
          },
          {
            color: 6,
            length: 5,
          },
          {
            color: 2,
            length: 1,
          },
          {
            color: 3,
            length: 0,
          },
          {
            color: 2,
            length: 2,
          },
          {
            color: 3,
            length: 2,
          },
          {
            color: 5,
            length: 2,
          },
          {
            color: 3,
            length: 0,
          },
          {
            color: 5,
            length: 1,
          },
        ],
        [
          {
            color: 0,
            length: 13,
          },
          {
            color: 6,
            length: 3,
          },
          {
            color: 2,
            length: 1,
          },
          {
            color: 3,
            length: 0,
          },
          {
            color: 2,
            length: 1,
          },
          {
            color: 5,
            length: 0,
          },
          {
            color: 3,
            length: 0,
          },
          {
            color: 5,
            length: 0,
          },
          {
            color: 3,
            length: 0,
          },
          {
            color: 5,
            length: 2,
          },
          {
            color: 3,
            length: 0,
          },
          {
            color: 5,
            length: 1,
          },
        ],
        [
          {
            color: 0,
            length: 12,
          },
          {
            color: 6,
            length: 1,
          },
          {
            color: 2,
            length: 2,
          },
          {
            color: 5,
            length: 2,
          },
          {
            color: 3,
            length: 0,
          },
          {
            color: 5,
            length: 5,
          },
        ],
        [
          {
            color: 0,
            length: 10,
          },
          {
            color: 5,
            length: 10,
          },
        ],
        [
          {
            color: 0,
            length: 7,
          },
          {
            color: 5,
            length: 7,
          },
        ],
        [],
      ],
      [
        [],
        [
          {
            color: 0,
            length: 3,
          },
        ],
        [
          {
            color: 0,
            length: 7,
          },
        ],
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
            length: 4,
          },
          {
            color: 4,
            length: 1,
          },
          {
            color: 0,
            length: 1,
          },
          {
            color: 4,
            length: 0,
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
            color: 4,
            length: 1,
          },
          {
            color: 0,
            length: 0,
          },
          {
            color: 4,
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
            color: 4,
            length: 4,
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
            color: 4,
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
            length: 3,
          },
          {
            color: 4,
            length: 5,
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
            color: 4,
            length: 5,
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
            color: 7,
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
            length: 5,
          },
          {
            color: 7,
            length: 4,
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
            color: 7,
            length: 1,
          },
          {
            color: 0,
            length: 0,
          },
          {
            color: 7,
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
            length: 4,
          },
          {
            color: 7,
            length: 1,
          },
          {
            color: 0,
            length: 1,
          },
          {
            color: 7,
            length: 0,
          },
          {
            color: 0,
            length: 3,
          },
        ],
        [
          {
            color: 0,
            length: 4,
          },
          {
            color: 6,
            length: 2,
          },
          {
            color: 0,
            length: 3,
          },
        ],
        [
          {
            color: 0,
            length: 2,
          },
          {
            color: 6,
            length: 4,
          },
          {
            color: 0,
            length: 1,
          },
        ],
        [
          {
            color: 0,
            length: 0,
          },
          {
            color: 6,
            length: 6,
          },
        ],
        [
          {
            color: 6,
            length: 7,
          },
        ],
        [
          {
            color: 6,
            length: 7,
          },
        ],
        [
          {
            color: 6,
            length: 7,
          },
        ],
        [
          {
            color: 6,
            length: 7,
          },
        ],
        [
          {
            color: 6,
            length: 6,
          },
        ],
        [
          {
            color: 1,
            length: 2,
          },
          {
            color: 6,
            length: 4,
          },
          {
            color: 2,
            length: 1,
          },
        ],
        [
          {
            color: 1,
            length: 2,
          },
          {
            color: 2,
            length: 1,
          },
          {
            color: 6,
            length: 2,
          },
          {
            color: 2,
            length: 3,
          },
        ],
        [
          {
            color: 1,
            length: 1,
          },
          {
            color: 3,
            length: 9,
          },
          {
            color: 2,
            length: 0,
          },
          {
            color: 5,
            length: 0,
          },
        ],
        [
          {
            color: 1,
            length: 1,
          },
          {
            color: 3,
            length: 0,
          },
          {
            color: 2,
            length: 0,
          },
          {
            color: 3,
            length: 0,
          },
          {
            color: 2,
            length: 8,
          },
          {
            color: 5,
            length: 0,
          },
        ],
        [
          {
            color: 1,
            length: 2,
          },
          {
            color: 3,
            length: 2,
          },
          {
            color: 2,
            length: 6,
          },
          {
            color: 5,
            length: 2,
          },
        ],
        [
          {
            color: 1,
            length: 1,
          },
          {
            color: 2,
            length: 3,
          },
          {
            color: 3,
            length: 3,
          },
          {
            color: 2,
            length: 1,
          },
          {
            color: 5,
            length: 3,
          },
        ],
        [
          {
            color: 1,
            length: 0,
          },
          {
            color: 2,
            length: 8,
          },
          {
            color: 3,
            length: 2,
          },
          {
            color: 5,
            length: 2,
          },
        ],
        [
          {
            color: 1,
            length: 0,
          },
          {
            color: 2,
            length: 9,
          },
          {
            color: 3,
            length: 0,
          },
          {
            color: 5,
            length: 0,
          },
          {
            color: 3,
            length: 0,
          },
          {
            color: 5,
            length: 1,
          },
        ],
        [
          {
            color: 2,
            length: 9,
          },
          {
            color: 3,
            length: 2,
          },
          {
            color: 5,
            length: 2,
          },
        ],
        [
          {
            color: 2,
            length: 5,
          },
          {
            color: 3,
            length: 3,
          },
          {
            color: 5,
            length: 5,
          },
        ],
        [
          {
            color: 2,
            length: 2,
          },
          {
            color: 3,
            length: 2,
          },
          {
            color: 2,
            length: 2,
          },
          {
            color: 5,
            length: 6,
          },
        ],
        [
          {
            color: 2,
            length: 1,
          },
          {
            color: 3,
            length: 0,
          },
          {
            color: 2,
            length: 0,
          },
          {
            color: 3,
            length: 0,
          },
          {
            color: 2,
            length: 2,
          },
          {
            color: 5,
            length: 7,
          },
        ],
        [
          {
            color: 2,
            length: 1,
          },
          {
            color: 3,
            length: 9,
          },
          {
            color: 5,
            length: 1,
          },
        ],
        [
          {
            color: 2,
            length: 4,
          },
          {
            color: 5,
            length: 6,
          },
        ],
        [
          {
            color: 2,
            length: 2,
          },
          {
            color: 5,
            length: 6,
          },
        ],
        [
          {
            color: 5,
            length: 6,
          },
        ],
        [],
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
          return '#FFFFFF'; // 16777215
        case 4:
          return '#022E41'; // 142913
        case 5:
          return '#AC76B3'; // 11302579
        case 6:
          return '#FF0000'; // 16711680
        case 7:
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
