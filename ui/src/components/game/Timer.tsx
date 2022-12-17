import React, { useEffect } from 'react';
import { useState } from 'react';
import { useHistory } from './History';

interface TimerContextObject {
  getSeconds(): number;
  resetTimer(): void;
}
const TimerContext = React.createContext<TimerContextObject>(null!);

export function GameTimer({ children }: { children: React.ReactNode }) {
  const [seconds, setSeconds] = useState<number>(0);
  const history = useHistory();

  const { winState } = history.getLatestSnapshot();
  useEffect(() => {
    const interval = setInterval(() => {
      if (winState) return;
      setSeconds(seconds => seconds + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [winState]);

  const context: TimerContextObject = {
    getSeconds() {
      return seconds;
    },
    resetTimer() {
      setSeconds(0);
    },
  };

  return <TimerContext.Provider value={context}>{children}</TimerContext.Provider>;
}
export function useGameTimer(): TimerContextObject {
  return React.useContext(TimerContext);
}

export function TimeDisplay() {
  const timer = useGameTimer();
  return <div>{new Date(1000 * (timer.getSeconds() + 1)).toISOString().substring(11, 11 + 8)}</div>;
}
