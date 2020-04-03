import React from "react";
import "./index.css";

function Square(props) {
  return (
    <div
      className={'square ' + 'square-' + props.value}
      onMouseDown={props.onMouseDown}
      onMouseUp={props.onMouseUp}
      onMouseEnter={props.onMouseEnter}
    > 
        <span class="material-icons">cancel</span>
    </div>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onMouseDown={(event) => this.props.onMouseDown(event, i)}
        onMouseUp={() => this.props.onMouseUp()}
        onMouseEnter={() => this.props.onMouseEnter(i)}
      />
    );
  }

  render() {
    const cols = [];
    let it = 0;
    for (let col = 0; col < this.props.cols; col++) {
      let temp = [];
      for (let row = 0; row < this.props.rows; row++) {
        temp.push(this.renderSquare(it++));
      }
      cols.push(temp);
    }
    const rows = [];
    for (let row = 0; row < this.props.rows; row++) {
      rows.push(<div className="board-row">{cols[row]}</div>);
    }
    return (
      <div>
        {rows}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: 5,
      cols: 5,
      current: [],
      history: [{
        squares: [],
      }],
      stepNumber: 0,
      lMouseDown: false,
      rMouseDown: false,
      currentAction: 'empty',
      changed: false,
      seconds: 0,
      timer: "00:00:00",
    };
  }

  tick() {
    this.setState(state => ({
      seconds: state.seconds + 1,
      timer: new Date(1000 * (this.state.seconds + 1)).toISOString().substr(11, 8)
    }));
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 1000);
    const size = this.state.rows * this.state.cols;
    const squares = Array(size).fill("empty");
    this.setState({
      current: squares,
      history: [{
        squares: squares,
      }],
    });
  }

  appendHistory() {
    if (!this.state.changed) {
      return;
    }

    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = this.state.current;

    if (current !== history[history.length - 1].squares) {
      this.setState({
        history: history.concat([
          {
            squares: current,
          }
        ]),
        stepNumber: history.length,
        changed: false,
      });
    } 

    this.setState({
      lMouseDown: false,
      rMouseDown: false,
      currentAction: 'empty',
    });
  }

  squareClick(event, i) {
    const current = this.state.current;
    const squares = current.slice();
    let lMouseDown = this.state.lMouseDown;
    let rMouseDown = this.state.rMouseDown;
    let currentAction = this.state.currentAction;
    let changed = this.state.changed;

    if (event.button === 0) {
      if (event.type === "mousedown") {
        lMouseDown = true;
        currentAction = (squares[i] === 'empty') ? 'filled' : 'empty';
        squares[i] = currentAction;
        changed = true;
      }
    } else if (event.button === 2) {
      if (event.type === "mousedown") {
        rMouseDown = true;
        currentAction = (squares[i] === 'empty') ? 'marked' : 'empty';
        squares[i] = currentAction;
        changed = true;
      }
    } else {
      return;
    }
    this.setState({
      current: squares,
      lMouseDown: lMouseDown,
      rMouseDown: rMouseDown,
      currentAction: currentAction,
      changed: changed,
    });
  }

  squareHover(i) {
    let lMouseDown = this.state.lMouseDown;
    let rMouseDown = this.state.rMouseDown;
    let changed = this.state.changed;
    
    if (!lMouseDown && !rMouseDown) return;

    const current = this.state.current;
    const squares = current.slice();
    let currentAction = this.state.currentAction;

    if (currentAction !== squares[i]) {
      squares[i] = currentAction;
      changed = true;
    } else {
      return;
    }
    
    this.setState({
      current: squares,
      changed: changed,
    });
  }

  jumpTo(step) {
    this.appendHistory();
    
    this.setState({
      current: this.state.history[step].squares,
      stepNumber: step,
    });
  }

  undo() {
    const stepNumber = this.state.stepNumber;

    if (!stepNumber) return;

    this.setState({
      current: this.state.history[stepNumber - 1].squares,
      stepNumber: stepNumber - 1,
    });
  }
  
  render() {
    const history = this.state.history;
    const current = this.state.current;

    /*
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

    return (
      <div className="game" onContextMenu={(e)=> e.preventDefault()}>
        <div className="game-info">
          <div>{this.state.timer}</div>
          <span class="material-icons" onClick={() => this.undo()}>undo</span>
        </div>
        <div className="game-board" onMouseLeave={() => this.appendHistory()}>
          <Board
            squares={current}
            rows={this.state.rows}
            cols={this.state.cols}
            onMouseDown={(event, i) => this.squareClick(event, i)}
            onMouseUp={() => this.appendHistory()}
            onMouseEnter={i => this.squareHover(i)}
          />
        </div>
      </div>
    );
  }
}

export default Game;
