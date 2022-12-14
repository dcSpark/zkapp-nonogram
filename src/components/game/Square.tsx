import React from 'react';
import { SquareValue } from '../common/constants';

/**
 * Translates individual board squares into HTML div elements.
 */
export function Square(props: {
  value: undefined | SquareValue;
  onMouseDown: React.MouseEventHandler<HTMLDivElement>;
  onMouseEnter: React.MouseEventHandler<HTMLDivElement>;
}) {
  const value: string = SquareValue[props.value ?? SquareValue.FILLED];
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
