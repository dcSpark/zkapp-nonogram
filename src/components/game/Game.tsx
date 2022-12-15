import React, { useEffect, useState } from 'react';
import { DimensionsChoices } from '../common/constants';
import { Board, useGameBoard } from './Board';
import { DimensionChoices } from './Dimension';
import { StreakSection } from './Streaks';
import './index.css';
import { useGameMouse } from './GameMouse';
import { useHistory } from './History';
import { useCallback } from 'react';
import { ColorChoices, ColorPicker } from './Colors';

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
    board.newRandomGame(board.getDimensions(), board.getNumColors());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateNewBoard = useCallback(() => {
    let nextDimensions;
    {
      const dimensionSel = document.getElementById('dimensions-select') as
        | HTMLSelectElement
        | undefined;
      if (dimensionSel == null) return;
      const dimensionSelectionIndex = dimensionSel.selectedIndex;
      nextDimensions = {
        rows: DimensionsChoices[dimensionSelectionIndex][1],
        cols: DimensionsChoices[dimensionSelectionIndex][0],
      };
    }
    let numColors;
    {
      const colorsSel = document.getElementById('colors-select') as HTMLSelectElement | undefined;
      if (colorsSel == null) return;
      numColors = colorsSel.selectedIndex + 1;
    }

    setSeconds(0);
    board.newRandomGame(nextDimensions, numColors);
    mouse.reset(true);
    history.reset(nextDimensions);
  }, []);

  const colorGenerator = board.getColorGenerator();
  const numColors = board.getNumColors();
  const indexedColorGenerator = React.useCallback(
    (index: number) => {
      return colorGenerator(numColors, index);
    },
    [colorGenerator, numColors]
  );
  return (
    <div
      className="game"
      onContextMenu={e => e.preventDefault()}
      onMouseUp={() => history.appendHistory()}
    >
      <div className="game-content">
        <div className="left-panel">
          <div className="game-info">
            <TimeDisplay seconds={seconds} />
            <div>{history.getLatestSnapshot().winState ? 'You won!' : ''}</div>
          </div>
        </div>
        <div className="right-panel">
          <div className="upper-board">
            <StreakSection
              genColor={indexedColorGenerator}
              currentStreaks={history.getLatestSnapshot().streaks.cols}
              expectedStreaks={board.getExpectedStreaks().cols}
              type="col"
            />
          </div>
          <div className="lower-board">
            <StreakSection
              genColor={indexedColorGenerator}
              currentStreaks={history.getLatestSnapshot().streaks.rows}
              expectedStreaks={board.getExpectedStreaks().rows}
              type="row"
            />
            <Board
              genColor={indexedColorGenerator}
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
            <ColorChoices onChange={generateNewBoard} />
          </div>
        </div>
        <ColorPicker
          colorGenerator={colorGenerator}
          numColors={numColors}
          selectedColor={mouse.getSelectedColor()}
          onSelect={color => mouse.setSelectedColor(color)}
        />
      </div>
    </div>
  );
}

export default Game;
