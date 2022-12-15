import React, { useEffect, useState } from 'react';
import { DimensionsChoices } from '../common/constants';
import { Board, useGameBoard } from './Board';
import { DimensionChoices } from './Dimension';
import { StreakSection } from './Streaks';
import './index.css';
import { useGameMouse } from './GameMouse';
import { useHistory } from './History';
import { useCallback } from 'react';

function TimeDisplay(props: { seconds: number }) {
  return <div>{new Date(1000 * (props.seconds + 1)).toISOString().substring(11, 11 + 8)}</div>;
}
export function Game() {
  const board = useGameBoard();
  const mouse = useGameMouse();
  const history = useHistory();

  const [seconds, setSeconds] = useState<number>(0);
  useEffect(() => {
    const interval = setInterval(() => {
      if (history.getLatestSnapshot().winState) return;
      setSeconds(seconds => seconds + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [history.getLatestSnapshot().winState]);

  useEffect(() => {
    board.newRandomGame(board.getDimensions());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateNewBoard = useCallback(() => {
    const sel = document.getElementById('dimensions-select') as HTMLSelectElement | undefined;
    if (sel == null) return;
    const index = sel.selectedIndex;
    const nextDimensions = {
      rows: DimensionsChoices[index][1],
      cols: DimensionsChoices[index][0],
    };

    setSeconds(0);
    board.newRandomGame(nextDimensions);
    mouse.reset();
    history.reset(nextDimensions);
  }, []);
  return (
    <div
      className="game"
      onContextMenu={e => e.preventDefault()}
      onMouseUp={() => history.appendHistory()}
    >
      <div className="left-panel">
        <div className="game-info">
          <TimeDisplay seconds={seconds} />
          <div>{history.getLatestSnapshot().winState ? 'You won!' : ''}</div>
        </div>
      </div>
      <div className="right-panel">
        <div className="upper-board">
          <StreakSection
            currentStreaks={history.getLatestSnapshot().streaks.cols}
            expectedStreaks={board.getExpectedStreaks().cols}
            type="col"
          />
        </div>
        <div className="lower-board">
          <StreakSection
            currentStreaks={history.getLatestSnapshot().streaks.rows}
            expectedStreaks={board.getExpectedStreaks().rows}
            type="row"
          />
          <Board
            getSquare={board.getSquare}
            dimensions={board.getDimensions()}
            onMouseDown={(event, loc) => mouse.squareClick(event, loc)}
            onMouseEnter={loc => mouse.squareHover(loc)}
          />
        </div>
        <div className="undo-redo">
          <span className="material-icons" onClick={() => history.undoAction()}>
            undo
          </span>
          <span className="material-icons" onClick={() => history.redoAction()}>
            redo
          </span>
          <span className="material-icons" onClick={generateNewBoard}>
            replay
          </span>
          <DimensionChoices onChange={generateNewBoard} />
        </div>
      </div>
    </div>
  );
}

export default Game;
