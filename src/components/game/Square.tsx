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
      {/* inline material UI SVG here so we can properly dynamically resize it*/}
      {/* otherwise we'd have to try and resize a font which is harder */}
      {props.value?.state === SquareFill.MARKED && (
        <div style={{ height: '75%', width: '75%' }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
            <path
              fill="red"
              d="m16.5 33.6 7.5-7.5 7.5 7.5 2.1-2.1-7.5-7.5 7.5-7.5-2.1-2.1-7.5 7.5-7.5-7.5-2.1 2.1 7.5 7.5-7.5 7.5ZM24 44q-4.1 0-7.75-1.575-3.65-1.575-6.375-4.3-2.725-2.725-4.3-6.375Q4 28.1 4 24q0-4.15 1.575-7.8 1.575-3.65 4.3-6.35 2.725-2.7 6.375-4.275Q19.9 4 24 4q4.15 0 7.8 1.575 3.65 1.575 6.35 4.275 2.7 2.7 4.275 6.35Q44 19.85 44 24q0 4.1-1.575 7.75-1.575 3.65-4.275 6.375t-6.35 4.3Q28.15 44 24 44Zm0-3q7.1 0 12.05-4.975Q41 31.05 41 24q0-7.1-4.95-12.05Q31.1 7 24 7q-7.05 0-12.025 4.95Q7 16.9 7 24q0 7.05 4.975 12.025Q16.95 41 24 41Zm0-17Z"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
