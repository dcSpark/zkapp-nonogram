import React from 'react';
import { SquareFill, SquareValue } from '../common/constants';

/**
 * Translates individual board squares into HTML div elements.
 */
export function Square(props: {
  value: undefined | SquareValue;
  genColor: (index: number) => string;
  onMouseDown: React.MouseEventHandler<HTMLDivElement>;
  onMouseEnter: React.MouseEventHandler<HTMLDivElement>;
}) {
  const value: string = SquareFill[props.value?.state ?? SquareFill.FILLED];
  return (
    <div
      className={'square square-' + value}
      style={
        props.value != null && props.value.state === SquareFill.FILLED
          ? { backgroundColor: props.genColor(props.value.color) }
          : {}
      }
      onMouseDown={props.onMouseDown}
      onMouseEnter={props.onMouseEnter}
    >
      <span className="material-icons">cancel</span>
    </div>
  );
}
