import React from 'react';
import { DefaultDimensions, DimensionsChoices, SquareValue } from '../common/constants';
import { Board, generateInitialBoard } from './Board';
import { DimensionChoices, DimensionType } from './Dimension';
import { StreakSection, BoardStreaks, Streak, StreakList } from './Streaks';
import './index.css';

type GameProps = {};
type GameState = {
  /** Number of rows and columns in game board. */
  dimensions: DimensionType;
  /** Current board state. */
  current: SquareValue[];
  /** History of board states. Initial board state will always be empty. */
  history: {
    squares: SquareValue[];
  }[];
  /** Index of history that we're currently at. */
  stepNumber: number;
  /** Current hint numbers. */
  currentHints: BoardStreaks;
  /** Goal hint numbers. */
  expectedStreaks: BoardStreaks;
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
  /** The number of seconds that have elapsed since board initialization. */
  seconds: number;
  /** A string timer keeping track of hours:minutes:seconds elapsed since board initialization. */
  timer: string;
};

/**
 * The main component that is called on by ReactDOM.render().
 */
class Game extends React.Component<GameProps, GameState> {
  interval: undefined | NodeJS.Timer;

  constructor(props: GameProps) {
    super(props);
    this.state = generateInitialBoard({
      rows: DefaultDimensions.ROWS,
      cols: DefaultDimensions.COLS,
    });
  }

  /**
   * Initially called by componentDidMount().
   *
   * Will be called once every 1,000 milliseconds (1 second)
   * in order to update the in-game clock.
   */
  tick(): void {
    this.setState(state => ({
      seconds: state.seconds + 1,
      timer: new Date(1000 * (this.state.seconds + 1)).toISOString().substr(11, 8),
    }));
  }

  /**
   * Called once on initial load.
   */
  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 1000);
    this.generateWinState();
  }

  /**
   * Called when component is updated.
   */
  componentDidUpdate(prevProps: GameProps, prevState: GameState) {
    if (!this.state.expectedStreaks.rows.length) {
      this.generateWinState();
    }
  }

  /**
   * Produces a randomly generated win state for the game board.
   *
   * The hint numbers are what determine the win state rather than
   * the actual board state because we're not necessarily generating
   * win states with only one solution.
   */
  generateWinState(): void {
    const size = this.state.dimensions.rows * this.state.dimensions.cols;
    const winSquares: SquareValue[] = [];

    for (let i = 0; i < size; i++) {
      winSquares.push(Math.random() < 0.5 ? SquareValue.EMPTY : SquareValue.FILLED);
    }

    this.setState({
      expectedStreaks: this.getUserFilledStreaks(winSquares),
    });
  }

  /**
   * Compares current hint numbers to goal hint numbers to see
   * if they match. If they match, the player has won.
   *
   * @returns {boolean} Whether or not the player has won.
   */
  winCheck(): boolean {
    if (!this.state.currentHints.rows.length) return false;

    // Compare row hint numbers.
    for (let a = 0; a < this.state.expectedStreaks.rows.length; a++) {
      if (this.state.expectedStreaks.rows[a].length !== this.state.currentHints.rows[a].length)
        return false;
      for (let b = 0; b < this.state.expectedStreaks.rows[a].length; b++) {
        if (!this.state.expectedStreaks.rows[a][b].equals(this.state.currentHints.rows[a][b]))
          return false;
      }
    }

    // Compare column hint numbers.
    for (let a = 0; a < this.state.expectedStreaks.cols.length; a++) {
      if (this.state.expectedStreaks.cols[a].length !== this.state.currentHints.cols[a].length)
        return false;
      for (let b = 0; b < this.state.expectedStreaks.cols[a].length; b++) {
        if (!this.state.expectedStreaks.cols[a][b].equals(this.state.currentHints.cols[a][b]))
          return false;
      }
    }

    return true;
  }

  /**
   * Retrieve square index in 1-D array using the
   * [row][column] indices one would expect from a 2-D array.
   *
   * @param {number} row Row that square is located.
   * @param {number} col Column that square is located.
   */
  getSquareIndex(row: number, col: number): number {
    return col + this.state.dimensions.cols * row;
  }

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
  appendHistory(): void {
    if (!this.state.changed) return;

    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = this.state.current;

    if (current !== history[history.length - 1].squares) {
      this.setState({
        history: history.concat([
          {
            squares: current,
          },
        ]),
        stepNumber: history.length,
        changed: false,
      });
    }

    this.setState({
      currentHints: this.getUserFilledStreaks(this.state.current),
      lMouseDown: false,
      rMouseDown: false,
      initialSquare: SquareValue.EMPTY,
      currentAction: SquareValue.EMPTY,
    });
  }

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
  squareClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>, loc: number): void {
    const current = this.state.current;
    const squares = current.slice();
    let lMouseDown = this.state.lMouseDown;
    let rMouseDown = this.state.rMouseDown;
    let initialSquare = squares[loc];
    let currentAction = this.state.currentAction;
    let changed = this.state.changed;

    if (event.button === 0) {
      if (event.type === 'mousedown') {
        lMouseDown = true;
        currentAction =
          initialSquare === SquareValue.EMPTY ? SquareValue.FILLED : SquareValue.EMPTY;
        squares[loc] = currentAction;
        changed = true;
      }
    } else if (event.button === 2) {
      if (event.type === 'mousedown') {
        rMouseDown = true;
        currentAction =
          initialSquare === SquareValue.EMPTY ? SquareValue.MARKED : SquareValue.EMPTY;
        squares[loc] = currentAction;
        changed = true;
      }
    } else {
      return;
    }
    this.setState({
      current: squares,
      lMouseDown: lMouseDown,
      rMouseDown: rMouseDown,
      initialSquare: initialSquare,
      currentAction: currentAction,
      changed: changed,
    });
  }

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
  squareHover(loc: number): void {
    let lMouseDown = this.state.lMouseDown;
    let rMouseDown = this.state.rMouseDown;
    let changed = this.state.changed;

    if (!lMouseDown && !rMouseDown) return;

    const current = this.state.current;
    const squares = current.slice();
    const initialSquare = this.state.initialSquare;
    const currentAction = this.state.currentAction;

    if (initialSquare === squares[loc]) {
      squares[loc] = currentAction;
      changed = true;
    } else {
      return;
    }

    this.setState({
      current: squares,
      changed: changed,
    });
  }

  /**
   * Retrieve row and column streaks and return them.
   *
   * @return {BoardStreaks} Return BoardStreaks object containing two arrays (rows[], cols[]).
   */
  getUserFilledStreaks(squares: SquareValue[]): BoardStreaks {
    const dimensions = this.state.dimensions;
    const boardStreaks = new BoardStreaks([], []);

    // Find row hint numbers.
    for (let row = 0; row < dimensions.rows; row++) {
      const streaksForRow: StreakList = [];
      let num: number = 0;

      for (let col = 0; col < dimensions.cols; col++) {
        if (squares[this.getSquareIndex(row, col)] === SquareValue.FILLED) num++;
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
        if (squares[this.getSquareIndex(row, col)] === SquareValue.FILLED) num++;
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

  /**
   * Jump to a particular point in the history of actions.
   * If the step doesn't exist in the history as an index, do nothing.
   *
   * @param {number} step The index of the action state to jump to.
   */
  jumpTo(step: number): void {
    if (step < 0 || step >= this.state.history.length) return;

    this.setState({
      current: this.state.history[step].squares,
      stepNumber: step,
    });
  }

  /**
   * Undo the most recent action.
   * If there is no action to undo, do nothing.
   *
   * As soon as we commit a new action, we cut off any actions
   * in front of the current action in the action history.
   */
  undoAction(): void {
    const stepNumber = this.state.stepNumber;

    if (!stepNumber) return;

    this.setState({
      current: this.state.history[stepNumber - 1].squares,
      stepNumber: stepNumber - 1,
    });
  }

  /**
   * Redo an undo.
   * If any actions have been undone by the undoAction()
   * function, we can redo them with this function.
   *
   * As soon as we commit a new action, we cut off any actions
   * in front of the current action in the action history.
   */
  redoAction(): void {
    const stepNumber = this.state.stepNumber;

    if (stepNumber === this.state.history.length - 1) return;

    this.setState({
      current: this.state.history[stepNumber + 1].squares,
      stepNumber: stepNumber + 1,
    });
  }

  /**
   * Restart with a new game board.
   */
  restart(): void {
    const sel = document.getElementById('dimensions-select') as HTMLSelectElement | undefined;
    if (sel == null) return;
    const index = sel.selectedIndex;
    const nextDimensions = {
      rows: DimensionsChoices[index][1],
      cols: DimensionsChoices[index][0],
    };

    this.setState(generateInitialBoard(nextDimensions));
  }

  render() {
    /*
    const history = this.state.history;
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    */

    const current = this.state.current;

    return (
      <div
        className="game"
        onContextMenu={e => e.preventDefault()}
        onMouseUp={() => this.appendHistory()}
      >
        <div className="left-panel">
          <div className="game-info">
            <div>{this.state.timer}</div>
            <div>{this.winCheck() ? 'You won!' : ''}</div>
          </div>
        </div>
        <div className="right-panel">
          <div className="upper-board">
            <StreakSection
              currentStreaks={this.state.currentHints.cols}
              expectedStreaks={this.state.expectedStreaks.cols}
              type="col"
            />
          </div>
          <div className="lower-board">
            <StreakSection
              currentStreaks={this.state.currentHints.rows}
              expectedStreaks={this.state.expectedStreaks.rows}
              type="row"
            />
            <Board
              squares={current}
              dimensions={this.state.dimensions}
              onMouseDown={(event, loc) => this.squareClick(event, loc)}
              onMouseEnter={loc => this.squareHover(loc)}
            />
          </div>
          <div className="undo-redo">
            <span className="material-icons" onClick={() => this.undoAction()}>
              undo
            </span>
            <span className="material-icons" onClick={() => this.redoAction()}>
              redo
            </span>
            <span className="material-icons" onClick={() => this.restart()}>
              replay
            </span>
            <DimensionChoices />
          </div>
        </div>
      </div>
    );
  }
}

export default Game;
