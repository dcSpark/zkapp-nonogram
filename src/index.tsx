import React from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import Game from './components/game/Game';
import { GameMouse } from './components/game/GameMouse';
import { GameBoard } from './components/game/Board';
import { GameHistory } from './components/game/History';
import { GameTimer } from './components/game/Timer';

// ========================================

const container = document.getElementById('app');
const root = createRoot(container!);
root.render(
  <GameBoard>
    <GameMouse>
      <GameHistory>
        <GameTimer>
          <Game />
        </GameTimer>
      </GameHistory>
    </GameMouse>
  </GameBoard>
);
