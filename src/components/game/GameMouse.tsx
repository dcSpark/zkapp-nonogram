import React from 'react';
import { useState } from 'react';
import { SquareFill, squareStateEqual, SquareValue } from '../common/constants';
import { useGameBoard } from './Board';

export type MouseState = {
  color: undefined | string;

  /** Whether or not the left mouse button is currently held down. */
  lMouseDown: boolean;
  /** Whether or not the right mouse button is currently held down. */
  rMouseDown: boolean;
  /** Value of first square clicked. Reset when mouse button is let go. */
  initialSquare: SquareValue;
  /** Value we're currently changing squares to. Reset when mouse button is let go. */
  currentAction: SquareValue;
  /** Whether or not the board's current state has been changed since the last time we appended to history. */
  changed: boolean;
};

interface GameMouseContextObject {
  /**
   * Deal with square click interaction.
   *
   * Should be called when user mouse cursor is hovering over
   * a square on the game board and a mouse button is pressed down.
   *
   * Will alter the value of that square, and initiate the process
   * of potentially holding the mouse button down and dragging over
   * other squares in order to also alter their values.
   *
   * @param {React.MouseEvent<HTMLDivElement, MouseEvent>} event Mouse event for determining which mouse button was pressed.
   * @param {number} loc Index of the square being clicked.
   */
  squareClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>, loc: number): void;

  /**
   * Deal with square hover interaction.
   *
   * Should be called when user mouse cursor is hovering over
   * a square on the game board.
   *
   * Will check if a mouse button is being held down,
   * and if one is, the square's value may be altered.
   *
   * @param {number} loc Index of the square being hovered over.
   */
  squareHover(loc: number): void;

  /**
   * fullReset → new board
   */
  reset(fullReset: boolean): void;

  getSelectedColor(): number;
  setSelectedColor(color: number): void;
}
const MouseContext = React.createContext<GameMouseContextObject>(null!);

export function GameMouse({ children }: { children: React.ReactNode }) {
  const [lMouseDown, setLMouseDown] = useState<boolean>(false);
  const [rMouseDown, setRMouseDown] = useState<boolean>(false);
  const [currentAction, setCurrentAction] = useState<SquareValue>({ state: SquareFill.EMPTY });
  const [selectedColor, setSelectedColor] = useState<number>(0);
  const board = useGameBoard();

  const context: GameMouseContextObject = {
    squareClick(event, loc) {
      const clickedSquare = board.getSquare(loc);

      if (event.button === 0) {
        if (event.type === 'mousedown') {
          setLMouseDown(true);
          const action: SquareValue =
            clickedSquare.state === SquareFill.EMPTY ||
            (clickedSquare.state === SquareFill.FILLED && clickedSquare.color !== selectedColor)
              ? { state: SquareFill.FILLED, color: selectedColor }
              : { state: SquareFill.EMPTY };
          setCurrentAction(action);
          board.setSquare(loc, action);
        }
      } else if (event.button === 2) {
        if (event.type === 'mousedown') {
          setRMouseDown(true);
          const action: SquareValue =
            clickedSquare.state === SquareFill.EMPTY
              ? { state: SquareFill.MARKED }
              : { state: SquareFill.EMPTY };
          setCurrentAction(action);
          board.setSquare(loc, action);
        }
      } else {
        return;
      }
    },
    squareHover(loc) {
      if (!lMouseDown && !rMouseDown) return;

      const hoveredSquare = board.getSquare(loc);
      // avoid triggering a bunch of setSquare calls if the state is the same
      if (squareStateEqual(hoveredSquare, currentAction)) return;
      board.setSquare(loc, currentAction);
    },
    getSelectedColor() {
      return selectedColor;
    },
    setSelectedColor(color) {
      setSelectedColor(color);
    },
    reset(fullReset: boolean) {
      setLMouseDown(false);
      setRMouseDown(false);
      setCurrentAction({ state: SquareFill.EMPTY });
      if (fullReset) {
        setSelectedColor(0);
      }
    },
  };
  return <MouseContext.Provider value={context}>{children}</MouseContext.Provider>;
}
export function useGameMouse(): GameMouseContextObject {
  return React.useContext(MouseContext);
}
