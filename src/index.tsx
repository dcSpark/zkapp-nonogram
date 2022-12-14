import React from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import Game from './components/game/Game';

// ========================================

const container = document.getElementById('app');
const root = createRoot(container!);
root.render(<Game />);
