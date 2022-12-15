import React from 'react';
import { ColorGenerator } from './Board';
import classNames from 'classnames';

/**
 * Produces a dropdown selection box for user to select the number of colors
 * of the game board when it's reset next.
 *
 * These choices are pulled from ../common/constants.ts.
 */
export function ColorChoices(props: { onChange: () => void }) {
  const choices: React.ReactElement[] = [];

  for (let i = 1; i < 10; i++) {
    choices.push(<option>{i}</option>);
  }

  return (
    <select onChange={props.onChange} id="colors-select">
      {choices}
    </select>
  );
}

/**
 * Translates individual board squares into HTML div elements.
 */
export function ColorSquare(props: {
  color: number;
  genColor: (index: number) => string;
  selected: boolean;
  onMouseDown: React.MouseEventHandler<HTMLDivElement>;
  onMouseEnter: React.MouseEventHandler<HTMLDivElement>;
}) {
  return (
    <div
      className={classNames({
        colorSquare: true,
        selected: props.selected,
      })}
      style={{ backgroundColor: props.genColor(props.color) }}
      onMouseDown={props.onMouseDown}
      onMouseEnter={props.onMouseEnter}
    />
  );
}

export function ColorPicker(props: {
  colorGenerator: ColorGenerator;
  numColors: number;
  selectedColor: number;
  onSelect: (color: number) => void;
}) {
  const colorOptions: React.ReactElement[] = [];
  for (let i = 0; i < props.numColors; i++) {
    colorOptions.push(
      <ColorSquare
        color={i}
        selected={i === props.selectedColor}
        genColor={i => props.colorGenerator(props.numColors, i)}
        onMouseDown={() => props.onSelect(i)}
        onMouseEnter={() => {}}
      />
    );
  }
  return (
    <div className="color-picker">
      <span>Colors</span>
      <div style={{ marginRight: '16px' }} />
      {colorOptions}
    </div>
  );
}
