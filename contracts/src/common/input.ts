export type JsonStreak = { color: string; length: number };
export type JsonStreaks = {
  rows: JsonStreak[][];
  columns: JsonStreak[][];
};
export const gameInfo: JsonStreaks = {
  rows: [
    [
      { color: '16553247', length: 1 },
      { color: '16553247', length: 1 },
      { color: '16553247', length: 2 },
      { color: '142913', length: 2 },
    ],
    [
      { color: '16553247', length: 1 },
      { color: '142913', length: 1 },
      { color: '16553247', length: 1 },
      { color: '16553247', length: 1 },
    ],
    [{ color: '16553247', length: 1 }],
    [
      { color: '16553247', length: 2 },
      { color: '142913', length: 2 },
      { color: '16553247', length: 1 },
      { color: '16553247', length: 1 },
    ],
    [
      { color: '16553247', length: 1 },
      { color: '142913', length: 1 },
      { color: '16553247', length: 1 },
      { color: '142913', length: 2 },
    ],
  ],
  columns: [
    [
      { color: '16553247', length: 1 },
      { color: '16553247', length: 2 },
    ],
    [{ color: '16553247', length: 1 }],
    [
      { color: '16553247', length: 2 },
      { color: '142913', length: 1 },
      { color: '16553247', length: 1 },
    ],
    [
      { color: '142913', length: 1 },
      { color: '142913', length: 2 },
    ],
    [{ color: '16553247', length: 1 }],
    [{ color: '16553247', length: 2 }],
    [{ color: '16553247', length: 2 }],
    [{ color: '142913', length: 1 }],
    [
      { color: '142913', length: 1 },
      { color: '142913', length: 1 },
    ],
    [
      { color: '16553247', length: 1 },
      { color: '16553247', length: 1 },
      { color: '142913', length: 1 },
    ],
  ],
};
