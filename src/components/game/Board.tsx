import React, { useState } from 'react';
import { DefaultDimensions, SquareValue } from '../common/constants';
import { DimensionType } from './Dimension';
import { Square } from './Square';
import { BoardStreaks, Streak, StreakList } from './Streaks';

type BoardProps = {
  getSquare: (loc: number) => SquareValue;
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
        rowLength={props.dimensions.cols}
        startIndex={row * props.dimensions.cols}
      />
    );
  }

  return <div className="game-board">{rows}</div>;
}

interface BoardContextObject {
  getDimensions(): DimensionType;

  /**
   * Produces a randomly generated win state for the game board.
   *
   * The hint numbers are what determine the win state rather than
   * the actual board state because we're not necessarily generating
   * win states with only one solution.
   */
  newRandomGame(newDimensions: DimensionType): void;
  getSize(): number;

  getExpectedStreaks(): BoardStreaks;

  getSquare(loc: number): SquareValue;
  setSquare(loc: number, value: SquareValue): void;
  setBoard(value: SquareValue[]): void;
  getBoard(): SquareValue[];
}
const BoardContext = React.createContext<BoardContextObject>(null!);

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
    Array(getSize(dimensions)).fill(SquareValue.EMPTY)
  );

  const context: BoardContextObject = {
    getDimensions() {
      return dimensions;
    },
    newRandomGame(newDimensions) {
      setDimensions(newDimensions);
      setSquares(Array(getSize(newDimensions)).fill(SquareValue.EMPTY));

      const size = newDimensions.rows * newDimensions.cols;
      const winSquares: SquareValue[] = [];

      for (let i = 0; i < size; i++) {
        winSquares.push(Math.random() < 0.5 ? SquareValue.EMPTY : SquareValue.FILLED);
      }

      // tricky point: to generate what the streaks are for the board
      // we generate what the streaks would be if the user entered the exact solution
      setExpectedStreaks(getUserFilledStreaks(newDimensions, winSquares));
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

  // Find row hint numbers.
  for (let row = 0; row < dimensions.rows; row++) {
    const streaksForRow: StreakList = [];
    let num: number = 0;

    for (let col = 0; col < dimensions.cols; col++) {
      if (squares[getSquareIndex(dimensions, row, col)] === SquareValue.FILLED) num++;
      else if (num) {
        streaksForRow.push(new Streak(num));
        num = 0;
      }
    }
    if (num || !streaksForRow.length) streaksForRow.push(new Streak(num));
    boardStreaks.rows.push(streaksForRow);
  }

  // Find column hint numbers.
  for (let col = 0; col < dimensions.cols; col++) {
    const streaksForColumn: StreakList = [];
    let num = 0;

    for (let row = 0; row < dimensions.rows; row++) {
      if (squares[getSquareIndex(dimensions, row, col)] === SquareValue.FILLED) num++;
      else if (num) {
        streaksForColumn.push(new Streak(num));
        num = 0;
      }
    }
    if (num || !streaksForColumn.length) streaksForColumn.push(new Streak(num));
    boardStreaks.cols.push(streaksForColumn);
  }

  return boardStreaks;
}
