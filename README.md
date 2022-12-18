# zkNonogram

[Try it out right here](TODO)

## Description

Nonograms, also known as Hanjie, Paint by Numbers, Picross, Griddlers, and Pic-a-Pix, and by various other names, are picture logic puzzles in which cells in a grid must be colored or left blank according to numbers at the side of the grid to reveal a hidden pixel art-like picture.

Learn more [on Wikipedia](https://en.wikipedia.org/wiki/Nonogram)

# Difficulties

- Can't use Lagrange polynomials to encode the solution as there may be multiple valid solutions
- Dynamic arrays are needed for two reasons:
  1. Streaks may be of variable length (ex: one row may be [2,4,6], but another row maybe [2,2,1,1])
  2. We can't encode streaks of 0 in the circuit, or that would give the solution just by reading out the circuit
- Circuit limit can't encode 40x20 picture

Two possible implementations:

1. Input: `<solution>`, Storage: `<hash of streaks>`
   1. Generate the streaks from the input solution
   2. Hash the streaks
   3. Compare vs a stored hash on-chain
1. Input: `<solution, streaks>`, Storage: `<hash of streaks>`
   1. Check the streaks provided matches the hash in storage
   2. Check each streak matches the provided solution
1. Input: `<solution>`, Storage: `all the streaks`
   1. Check the solution matches the streaks

(1) does not work because the circuit size to generate the streaks is empirically too large. Anything more than a 5x5 grid goes over the max SRS limit due to heavy usage of dynamic arrays

(3) is not ideal as the on-chain storage grows as the nonogram size increases which means you will quickly hit the maximum. However, storing the streaks on-chain is nice because it means you don't need to connect to a UI that knows the pre-image of hash-of-streaks in order to be able to render the nonogram

# How to build

Note that `solution.ts` is missing. This is because if we uploaded the solution to Github, it would defeat the point!

However, you can find a `testSolutions.ts` file with a few different tests you can play around with

## Controls

These are the default controls. There are currently only mouse controls, but I hope to add keyboard controls soon.

### Mouse controls

The mouse controls are fairly basic:

- `Left Mouse Click` - Fill box if clear. Clear box if not clear. Interact with buttons.
- `Right Mouse Click` - Mark box if clear. Clear box if not clear.

These two mouse buttons can also be held down in order to fill/clear multiple boxes. They will maintain the same command that was executed on the first box for convenience. This means that if you press the left mouse button and your cursor is hovering over a cleared box, as long as you keep that left mouse button held down, any other cleared box your cursor hovers over will be filled. Anything besides cleared boxes won't be altered.

This also means that commands are executed on mouse button down rather than on mouse button release.

### Interface

There's also a couple of buttons alongside the bottom of the board. These are in a very early stage of implementation in terms of appearance, but functionally they work as intended:

From left to right in order of appearance, the buttons are:

- `Undo` - Travel back to the previous board state.
- `Redo` - Travel forward to the next board state. Undo an undo.
- `Restart` - Wipe the board clean and generate a new random win state with a board size based on the dimensions in the box to the right of it.
- `Dimensions Selection` - A dropdown selection box with various board dimensions to choose from. In order to generate a board with these dimensions, hit the `Restart` button to the left of this box.

![Example of interface usage](https://i.imgur.com/6fbO36N.gif)

## How to play

There are numbers near each column and row of the board. These numbers indicate sequences of filled in blocks. For example, take a look at the image below:

![Example image of 5x5 solution](https://i.imgur.com/vPTTS1a.png)

This is the final solution to this particular Nonogram. From glancing at this, we can see that sequences of filled in boxes maintain the same order given by the order of the numbers nearby. We can also see that sequences of filled in boxes need at least one white box of separation. In order to assist you in remembering which boxes cannot be filled in, you can `right click` a box in order to mark it. You don't need to mark any boxes in order to win. They're just there to help you.

### Winning

The win condition is based entirely on which boxes you've filled in. Every time you fill or clear a box, the game checks to see if your board state matches that of the winning board. This takes into account the fact that some boards might not have a unique solution.

The progress tracker doesn't indicate correctness. You can fill an incorrect box, and it will still add that box to your progress.

You'll notice as you progress that the hint numbers will automatically change to a darker color. This indicates that the game thinks that particular sequence is taken care of. This exists in order to assist the player so they don't have to remember which sequences they've completed.

Here's a gif of me solving a basic 5x5 Nonogram from start to finish:

![Gif of solving 5x5 Nonogram](https://i.imgur.com/0yIdX0Z.gif)
