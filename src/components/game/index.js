import React from "react";
import { DefaultDimensions, SquareValue, DimensionsChoices } from "../common/constants.js";
import "./index.css";

/**
 * Produces a dropdown selection box for user to select the dimensions
 * of the game board when it's reset next.
 * 
 * These choices are pulled from ../common/constants.js.
 */
function DimensionChoices() {
  let choices = [];

  for (let i = 0; i < DimensionsChoices.length; i++) {
    choices.push(<option>{DimensionsChoices[i][0] + "x" + DimensionsChoices[i][1]}</option>)
  }

  return (
    <select id="dimensions-select">
      {choices}
    </select>
  )
}

/**
 * Translates either row or column hint numbers into HTML div elements.
 * 
 * @param {*} props 
 */
function HintNumbers(props) {
  let hintNumbers = [];

  for (let a = 0; a < props.values.length; a++) {
    let aSection = [];

    for (let b = 0; b < props.values[a].length; b++) {
      aSection.push(<div className="hint">{props.values[a][b]}</div>);
    }

    hintNumbers.push(<div className={"hint-" + props.type}>{aSection}</div>);
  }

  return (
    <div className={props.area + '-hints'}>
      {hintNumbers}
    </div>
  );
}

/**
 * Translates individual board squares into HTML div elements.
 * 
 * @param {*} props 
 */
function Square(props) {
  const index = (typeof props.value === 'undefined') ? 1 : props.value;
  const value = SquareValue.properties[index].name;

  return (
    <div
      className={'square square-' + value}
      onMouseDown={props.onMouseDown}
      onMouseEnter={props.onMouseEnter}
    > 
      <span className="material-icons">cancel</span>
    </div>
  );
}

/**
 * A game board made up of squares.
 */
class Board extends React.Component {
  renderSquare(loc) {
    return (
      <Square
        value={this.props.squares[loc]}
        onMouseDown={(event) => this.props.onMouseDown(event, loc)}
        onMouseEnter={() => this.props.onMouseEnter(loc)}
      />
    );
  }

  render() {
    const cols = [];
    let loc = 0

    for (let col = 0; col < this.props.dimensions.rows; col++) {
      let temp = [];
      for (let row = 0; row < this.props.dimensions.cols; row++) {
        temp.push(this.renderSquare(loc++));
      }
      cols.push(temp);
    }

    const rows = [];
    for (let row = 0; row < this.props.dimensions.rows; row++) {
      rows.push(<div className="board-row">{cols[row]}</div>);
    }
    return (
      <div className="game-board">
        {rows}
      </div>
    );
  }
}

/**
 * The main component that is called on by ReactDOM.render().
 */
class Game extends React.Component {
  constructor(props) {
    super(props);
    const size = DefaultDimensions.ROWS * DefaultDimensions.COLS;

    this.state = {
      /** Number of rows and columns in game board. */
      dimensions: {
        rows: DefaultDimensions.ROWS,
        cols: DefaultDimensions.COLS,
      },
      /** Current board state. */
      current: Array(size).fill(SquareValue.EMPTY),
      /** History of board states. Initial board state will always be empty. */
      history: [{
        squares: Array(size).fill(SquareValue.EMPTY),
      }],
      /** Index of history that we're currently at. */
      stepNumber: 0,
      /** Current hint numbers. */
      currentHints: {
        rows: [],
        cols: [],
      },
      /** Goal hint numbers. */
      goalHints: {
        rows: [],
        cols: [],
      },
      /** Whether or not the left mouse button is currently held down. */
      lMouseDown: false,
      /** Whether or not the right mouse button is currently held down. */
      rMouseDown: false,
      /** Value of first square clicked. Reset when mouse button is let go. */
      initialSquare: SquareValue.EMPTY,
      /** Value we're currently changing squares to. Reset when mouse button is let go. */
      currentAction: SquareValue.EMPTY,
      /** Whether or not the board's current state has been changed since the last time we appended to history. */
      changed: false,
      /** The number of seconds that have elapsed since board initialization. */
      seconds: 0,
      /** A string timer keeping track of hours:minutes:seconds elapsed since board initialization. */
      timer: "00:00:00",
    };
  }

  /**
   * Initially called by componentDidMount().
   * 
   * Will be called once every 1,000 milliseconds (1 second)
   * in order to update the in-game clock.
   */
  tick() {
    this.setState(state => ({
      seconds: state.seconds + 1,
      timer: new Date(1000 * (this.state.seconds + 1)).toISOString().substr(11, 8)
    }));
  }

  /**
   * Called once on initial load.
   */
  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 1000);
  }

  /**
   * Retrieve square index in 1-D array using the
   * [row][column] indices one would expect from a 2-D array.
   * 
   * @param {Number} row Row that square is located.
   * @param {Number} col Column that square is located.
   */
  getSquareIndex(row, col) {
    return col + (this.state.dimensions.cols * row);
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
  appendHistory() {
    if (!this.state.changed) return;

    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = this.state.current;
    const hintNumbers = this.getHintNumbers();

    if (current !== history[history.length - 1].squares) {
      this.setState({
        history: history.concat([
          {
            squares: current,
          }
        ]),
        stepNumber: history.length,
        currentHints: hintNumbers,
        changed: false,
      });
    }

    this.setState({
      lMouseDown: false,
      rMouseDown: false,
      initialSquare: SquareValue.EMPTY,
      currentAction: SquareValue.EMPTY,
    });

    console.log(this.state.currentHints);
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
   * @param {MouseEvent} event Mouse event for determining which mouse button was pressed.
   * @param {Number} loc Index of the square being clicked.
   */
  squareClick(event, loc) {
    const current = this.state.current;
    const squares = current.slice();
    let lMouseDown = this.state.lMouseDown;
    let rMouseDown = this.state.rMouseDown;
    let initialSquare = squares[loc];
    let currentAction = this.state.currentAction;
    let changed = this.state.changed;

    if (event.button === 0) {
      if (event.type === "mousedown") {
        lMouseDown = true;
        currentAction = (initialSquare === SquareValue.EMPTY) ? SquareValue.FILLED : SquareValue.EMPTY;
        squares[loc] = currentAction;
        changed = true;
      }
    } else if (event.button === 2) {
      if (event.type === "mousedown") {
        rMouseDown = true;
        currentAction = (initialSquare === SquareValue.EMPTY) ? SquareValue.MARKED : SquareValue.EMPTY;
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
   * @param {Number} loc Index of the square being hovered over.
   */
  squareHover(loc) {
    let lMouseDown = this.state.lMouseDown;
    let rMouseDown = this.state.rMouseDown;
    let changed = this.state.changed;
    
    if (!lMouseDown && !rMouseDown) return;

    const current = this.state.current;
    const squares = current.slice();
    let initialSquare = this.state.initialSquare;
    let currentAction = this.state.currentAction;

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
   * Retrieve row and column hint numbers and return them.
   * 
   * @return {Object} Return object containing two arrays (rows[], cols[]).
   */
  getHintNumbers() {
    const current = this.state.current;
    const dimensions = this.state.dimensions;
    const hintNumbers = {
      rows: [],
      cols: [],
    };

    // Find row hint numbers.
    for (let row = 0; row < dimensions.rows; row++) {
      let rowHints = [];
      let num = 0;

      for ( let col = 0; col < dimensions.cols; col++) {
        if (current[this.getSquareIndex(row, col)] === SquareValue.FILLED) num++;
        else if (num) {
          rowHints.push(num);
          num = 0;
        }
      }
      if (num || !rowHints.length) rowHints.push(num);
      hintNumbers.rows.push(rowHints);
    }

    // Find column hint numbers.
    for (let col = 0; col < dimensions.cols; col++) {
      let colHints = [];
      let num = 0;

      for ( let row = 0; row < dimensions.rows; row++) {
        if (current[this.getSquareIndex(row, col)] === SquareValue.FILLED) num++;
        else if (num) {
          colHints.push(num);
          num = 0;
        }
      }
      if (num || !colHints.length) colHints.push(num);
      hintNumbers.cols.push(colHints);
    }

    return hintNumbers;
  }

  /**
   * Jump to a particular point in the history of actions.
   * If the step doesn't exist in the history as an index, do nothing.
   * 
   * @param {Number} step The index of the action state to jump to.
   */
  jumpTo(step) {
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
  undoAction() {
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
  redoAction() {
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
  restart() {
    let sel = document.getElementById('dimensions-select');
    const index = sel.selectedIndex;
    const nextDimensions = {
      rows: DimensionsChoices[index][1],
      cols: DimensionsChoices[index][0]
    }
    const size = nextDimensions.rows * nextDimensions.cols;

    this.setState({
      dimensions: nextDimensions,
      current: Array(size).fill(SquareValue.EMPTY),
      history: [{
        squares: Array(size).fill(SquareValue.EMPTY),
      }],
      stepNumber: 0,
      currentHints: {
        rows: [],
        cols: [],
      },
      goalHints: {
        rows: [],
        cols: [],
      },
      lMouseDown: false,
      rMouseDown: false,
      initialSquare: SquareValue.EMPTY,
      currentAction: SquareValue.EMPTY,
      changed: false,
      seconds: 0,
      timer: "00:00:00",
    })
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
        onContextMenu={(e)=> e.preventDefault()}
        onMouseUp={() => this.appendHistory()}
      >
        <div className="left-panel">
          <div className="game-info">
            <div>{this.state.timer}</div>
          </div>
        </div>
        <div className="right-panel">
          <div className="upper-board">
            <HintNumbers
              values={this.state.currentHints.cols}
              area='upper'
              type='col'
            />
          </div>
          <div className="lower-board">
            <HintNumbers
              values={this.state.currentHints.rows}
              area='left'
              type='row'
            />
            <Board
              squares={current}
              dimensions={this.state.dimensions}
              onMouseDown={(event, loc) => this.squareClick(event, loc)}
              onMouseEnter={loc => this.squareHover(loc)}
            />
          </div>
          <div className="undo-redo">
            <span className="material-icons" onClick={() => this.undoAction()}>undo</span>
            <span className="material-icons" onClick={() => this.redoAction()}>redo</span>
            <span className="material-icons" onClick={() => this.restart()}>replay</span>
            <DimensionChoices/>
          </div>
        </div>
      </div>
    );
  }
}

export default Game;
