import React, { useState } from 'react';
import { BoardDescription } from '../../prepackaged';
import {
  createColors,
  DefaultDimensions,
  indexToColor,
  SnarkyJSEmptyColor,
  SquareFill,
  SquareValue,
} from '../common/constants';
import { DimensionType } from './Dimension';
import { Square } from './Square';
import { BoardStreaks, Streak, StreakList } from './Streaks';

type BoardProps = {
  emptySquareColor: string;
  getSquare: (loc: number) => SquareValue;
  genColor: (index: number) => string;
  dimensions: DimensionType;
  onMouseDown: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, loc: number) => void;
  onMouseEnter: (loc: number) => void;
};

function BoardRow(props: BoardProps & { startIndex: number; rowLength: number }) {
  const rowElements: React.ReactElement[] = [];
  for (let i = 0; i < props.rowLength; i++) {
    const loc = props.startIndex + i;
    rowElements.push(
      <Square
        key={loc}
        emptySquareColor={props.emptySquareColor}
        genColor={props.genColor}
        value={props.getSquare(loc)}
        onMouseDown={event => props.onMouseDown(event, loc)}
        onMouseEnter={() => props.onMouseEnter(loc)}
      />
    );
  }
  return <div className="board-row">{rowElements}</div>;
}

/**
 * A game board made up of squares.
 */
export function Board(props: BoardProps) {
  const rows: React.ReactElement[] = [];

  for (let row = 0; row < props.dimensions.rows; row++) {
    rows.push(
      <BoardRow
        {...props}
        key={row}
        rowLength={props.dimensions.cols}
        startIndex={row * props.dimensions.cols}
      />
    );
  }

  return <div className="game-board">{rows}</div>;
}

export function boardToContractForm(
  dimensions: DimensionType,
  board: SquareValue[],
  description: BoardDescription,
  numColors: number
): number[][] {
  const toColor = (index: number) => {
    const colorHex = description.colorGenerator(numColors, index);
    return indexToColor(colorHex);
  };
  const result = [];
  for (let i = 0; i < dimensions.rows; i++) {
    const row = [];
    for (let j = 0; j < dimensions.cols; j++) {
      const val = board[getSquareIndex(dimensions, i, j)];
      const contractVal = val.state === SquareFill.FILLED ? toColor(val.color) : SnarkyJSEmptyColor;
      row.push(contractVal);
    }
    result.push(row);
  }

  return result;
}

interface BoardContextObject {
  getDimensions(): DimensionType;
  getSize(): number;

  /**
   * Produces a randomly generated win state for the game board.
   *
   * The hint numbers are what determine the win state rather than
   * the actual board state because we're not necessarily generating
   * win states with only one solution.
   */
  newRandomGame(newDimensions: DimensionType, newNumColors: number): void;

  newFixedGame(board: BoardDescription): void;

  getExpectedStreaks(): BoardStreaks;

  getSquare(loc: number): SquareValue;
  setSquare(loc: number, value: SquareValue): void;
  setBoard(value: SquareValue[]): void;
  getBoard(): SquareValue[];
  getBoardDescription(): BoardDescription | undefined;

  getNumColors(): number;
  getColorGenerator(): ColorGenerator;
  getDefaultColor(): string;
}
const BoardContext = React.createContext<BoardContextObject>(null!);

export type ColorGenerator = (numColor: number, index: number) => string;

const defaultCreateColor: ColorGenerator = (num, i) => createColors(num)[i];

export function GameBoard({ children }: { children: React.ReactNode }) {
  /** Number of rows and columns in game board. */
  const [dimensions, setDimensions] = useState<DimensionType>({
    rows: DefaultDimensions.ROWS,
    cols: DefaultDimensions.COLS,
  });
  /** Goal streaks to solve board */
  const [expectedStreaks, setExpectedStreaks] = useState<BoardStreaks>(new BoardStreaks([], []));
  /** Current board state. */
  const [squares, setSquares] = useState<SquareValue[]>(
    Array(getSize(dimensions)).fill({ state: SquareFill.EMPTY })
  );
  const [numColors, setNumColors] = useState<number>(1);
  const [colorGenerator, setColorGenerator] = useState<ColorGenerator>(() => defaultCreateColor);
  const [defaultColor, setDefaultColor] = useState<string>('#FFFFFF');
  const [boardDescription, setBoardDescription] = useState<BoardDescription | undefined>(undefined);

  const context: BoardContextObject = {
    getDimensions() {
      return dimensions;
    },
    newRandomGame(newDimensions, newNumColors) {
      setBoardDescription(undefined);
      setDimensions(newDimensions);
      setNumColors(newNumColors);
      setSquares(Array(getSize(newDimensions)).fill({ state: SquareFill.EMPTY }));
      setDefaultColor('#FFFFFF');

      const size = newDimensions.rows * newDimensions.cols;
      const winSquares: SquareValue[] = [];

      for (let i = 0; i < size; i++) {
        const color = Math.floor(Math.random() * newNumColors);
        winSquares.push(
          Math.random() < 0.5 ? { state: SquareFill.EMPTY } : { state: SquareFill.FILLED, color }
        );
      }

      // tricky point: to generate what the streaks are for the board
      // we generate what the streaks would be if the user entered the exact solution
      setExpectedStreaks(getUserFilledStreaks(newDimensions, winSquares));
    },
    newFixedGame(boardDescription) {
      setBoardDescription(boardDescription);
      setDimensions(boardDescription.dimensions);
      setNumColors(boardDescription.expectedStreaks.maxColor() + 1);
      setSquares(Array(getSize(boardDescription.dimensions)).fill({ state: SquareFill.EMPTY }));
      setColorGenerator(() => boardDescription.colorGenerator);
      setExpectedStreaks(boardDescription.expectedStreaks);
      setDefaultColor(boardDescription.defaultColor);
    },
    getSize() {
      return getSize(dimensions);
    },
    getExpectedStreaks() {
      return expectedStreaks;
    },
    getSquare(loc) {
      return squares[loc];
    },
    setSquare(loc, value) {
      setSquares(oldSquares => {
        const copy = [...oldSquares];
        copy[loc] = value;
        return copy;
      });
    },
    setBoard(value) {
      setSquares(value);
    },
    getBoard() {
      return squares;
    },
    getBoardDescription() {
      return boardDescription;
    },
    getColorGenerator() {
      return colorGenerator;
    },
    getNumColors() {
      return numColors;
    },
    getDefaultColor() {
      return defaultColor;
    },
  };
  return <BoardContext.Provider value={context}>{children}</BoardContext.Provider>;
}
export function useGameBoard(): BoardContextObject {
  return React.useContext(BoardContext);
}

function getSize(dimensions: DimensionType) {
  return dimensions.rows * dimensions.cols;
}

/**
 * Retrieve square index in 1-D array using the
 * [row][column] indices one would expect from a 2-D array.
 *
 * @param {number} row Row that square is located.
 * @param {number} col Column that square is located.
 */
function getSquareIndex(dimensions: DimensionType, row: number, col: number): number {
  return col + dimensions.cols * row;
}

/**
 * Retrieve row and column streaks and return them.
 *
 * @return {BoardStreaks} Return BoardStreaks object containing two arrays (rows[], cols[]).
 */
export function getUserFilledStreaks(
  dimensions: DimensionType,
  squares: SquareValue[]
): BoardStreaks {
  const boardStreaks = new BoardStreaks([], []);

  const addNext = (
    streaksForRow: StreakList,
    currentStreak: Streak | null,
    col: number,
    row: number
  ): Streak | null => {
    const squareValue = squares[getSquareIndex(dimensions, row, col)];

    // not filled → end streak
    if (squareValue.state !== SquareFill.FILLED) {
      return null;
    }

    // 1st value → start new streak
    if (currentStreak == null) {
      const newStreak: Streak = { color: squareValue.color, length: 1 };
      streaksForRow.push(newStreak);
      return newStreak;
    }

    // color matches → continue streak
    if (squareValue.color === currentStreak.color) {
      currentStreak.length++;
      return currentStreak;
    }

    // color doesn't match → new streak
    const newStreak: Streak = { color: squareValue.color, length: 1 };
    streaksForRow.push(newStreak);

    return newStreak;
  };
  // Find row streak numbers.
  for (let row = 0; row < dimensions.rows; row++) {
    const streaksForRow: StreakList = [];
    let currentStreak: Streak | null = null;

    for (let col = 0; col < dimensions.cols; col++) {
      currentStreak = addNext(streaksForRow, currentStreak, col, row);
    }
    currentStreak = null;
    boardStreaks.rows.push(streaksForRow);
  }

  // Find column streak numbers.
  for (let col = 0; col < dimensions.cols; col++) {
    const streaksForColumn: StreakList = [];
    let currentStreak: Streak | null = null;

    for (let row = 0; row < dimensions.rows; row++) {
      currentStreak = addNext(streaksForColumn, currentStreak, col, row);
    }
    currentStreak = null;
    boardStreaks.cols.push(streaksForColumn);
  }

  return boardStreaks;
}
