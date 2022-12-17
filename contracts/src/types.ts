import {
    Field,
    Struct,
} from 'snarkyjs';

/**
 * we choose to represent colors as a single number
 * that is just the decimal representation of its hex value
 */
export class Color extends Field {
    // has to be initialized to undefined because we have to wait for `await isReady`
    private static NO_COLOR: Color | undefined;

    constructor(value: string | number | bigint | boolean | Field) {
        super(Field(value));
    }

    static hexToFields(color: string): Color {
        return new Color(Number.parseInt(color, 16));
    }

    static noColor(): Color {
        if (Color.NO_COLOR == null) {
            Color.NO_COLOR = new Color(Field(-1))
        }
        return Color.NO_COLOR;
    }
}

export class ColoredStreak extends Struct({
    color: Color,
    length: Field,
}) {
}
