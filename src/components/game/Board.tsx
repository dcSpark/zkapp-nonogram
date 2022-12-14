import React from 'react';
import { SquareValue } from '../common/constants';
import { DimensionType } from './Dimension';
import { BoardStreaks } from './Streaks';
import { Square } from './Square';

type BoardProps = {
  squares: SquareValue[];
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
        value={props.squares[loc]}
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

export function generateInitialBoard(dimensions: DimensionType) {
  const size = dimensions.rows * dimensions.cols;
  return {
    dimensions,
    current: Array(size).fill(SquareValue.EMPTY),
    history: [
      {
        squares: Array(size).fill(SquareValue.EMPTY),
      },
    ],
    stepNumber: 0,
    currentHints: new BoardStreaks(
      Array(dimensions.rows).fill([0]),
      Array(dimensions.cols).fill([0])
    ),
    expectedStreaks: new BoardStreaks([], []),
    lMouseDown: false,
    rMouseDown: false,
    initialSquare: SquareValue.EMPTY,
    currentAction: SquareValue.EMPTY,
    changed: false,
    seconds: 0,
    timer: '00:00:00',
  };
}
