import React from 'react';
import { useState } from 'react';
import { SquareValue } from '../common/constants';
import { getUserFilledStreaks, useGameBoard } from './Board';
import { DimensionType } from './Dimension';
import { useGameMouse } from './GameMouse';
import { BoardStreaks } from './Streaks';

type HistorySnapshot = {
  streaks: BoardStreaks;
  squares: SquareValue[];
  winState: boolean;
};

interface HistoryContextObject {
  /**
   * Append current board state to history of board states.
   *
   * Should be called whenever we finish changing square values.
   *
   * At the moment, this is called whenever we let go of a mouse button.
   * This means we can capture multiple square value changes in a single
   * append as long as the mouse button is held down and the cursor is
   * dragged over multiple squares.
   */
  appendHistory(): void;

  /**
   * Undo the most recent action.
   * If there is no action to undo, do nothing.
   *
   * As soon as we commit a new action, we cut off any actions
   * in front of the current action in the action history.
   */
  undoAction(): void;

  /**
   * Redo an undo.
   * If any actions have been undone by the undoAction()
   * function, we can redo them with this function.
   *
   * As soon as we commit a new action, we cut off any actions
   * in front of the current action in the action history.
   */
  redoAction(): void;

  latestSnapshot: HistorySnapshot;

  reset(dimensions: DimensionType): void;
}
const HistoryContext = React.createContext<HistoryContextObject>(null!);

function genInitialHistory(dimensions: DimensionType): HistorySnapshot {
  return {
    streaks: new BoardStreaks(Array(dimensions.rows).fill([]), Array(dimensions.cols).fill([])),
    squares: Array(dimensions.rows * dimensions.cols).fill(SquareValue.EMPTY),
    winState: false,
  };
}

export function GameHistory({ children }: { children: React.ReactNode }) {
  const board = useGameBoard();
  const mouse = useGameMouse();

  /** History of board states. Initial board state will always be empty. */
  const [history, setHistory] = useState<HistorySnapshot[]>([
    genInitialHistory(board.getDimensions()),
  ]);
  /** Index of history that we're currently at. Used for rewinding then replaying state */
  const [stepNumber, setStepNumber] = useState<number>(0);

  const context: HistoryContextObject = {
    appendHistory() {
      const historyUntilStep = history.slice(0, stepNumber + 1);

      const squares = board.getBoard();
      if (!hasBoardChanged(historyUntilStep[historyUntilStep.length - 1].squares, squares)) {
        return;
      }

      const newStreaks = getUserFilledStreaks(board.getDimensions(), squares);
      setHistory(
        historyUntilStep.concat([
          {
            squares: squares,
            streaks: newStreaks,
            winState: checkWinState(board.getExpectedStreaks(), newStreaks),
          },
        ])
      );
      setStepNumber(historyUntilStep.length);
      mouse.reset();
    },
    undoAction() {
      if (stepNumber === 0) return;
      board.setBoard(history[stepNumber - 1].squares);
      setStepNumber(step => step - 1);
    },
    redoAction() {
      if (stepNumber === history.length - 1) return;

      board.setBoard(history[stepNumber + 1].squares);
      setStepNumber(step => step + 1);
    },
    latestSnapshot: history[stepNumber],
    reset(dimensions: DimensionType) {
      setStepNumber(0);
      setHistory([genInitialHistory(dimensions)]);
    },
  };
  return <HistoryContext.Provider value={context}>{children}</HistoryContext.Provider>;
}
export function useHistory(): HistoryContextObject {
  return React.useContext(HistoryContext);
}

function hasBoardChanged(oldBoard: SquareValue[], newBoard: SquareValue[]): boolean {
  // sanity check
  if (newBoard.length !== oldBoard.length) {
    return false;
  }
  for (let i = 0; i < newBoard.length; i++) {
    if (newBoard[i] !== oldBoard[i]) {
      return true;
    }
  }
  return false;
}

/**
 * Compares current hint numbers to goal hint numbers to see
 * if they match. If they match, the player has won.
 *
 * @returns {boolean} Whether or not the player has won.
 */
function checkWinState(expectedStreaks: BoardStreaks, currentStreaks: BoardStreaks): boolean {
  // Compare row streaks
  for (let a = 0; a < expectedStreaks.rows.length; a++) {
    if (expectedStreaks.rows[a].length !== currentStreaks.rows[a].length) return false;
    for (let b = 0; b < expectedStreaks.rows[a].length; b++) {
      if (!expectedStreaks.rows[a][b].equals(currentStreaks.rows[a][b])) return false;
    }
  }

  // Compare column streaks
  for (let a = 0; a < expectedStreaks.cols.length; a++) {
    if (expectedStreaks.cols[a].length !== currentStreaks.cols[a].length) return false;
    for (let b = 0; b < expectedStreaks.cols[a].length; b++) {
      if (!expectedStreaks.cols[a][b].equals(currentStreaks.cols[a][b])) return false;
    }
  }

  return true;
}
