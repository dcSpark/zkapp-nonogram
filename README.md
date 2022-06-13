# React-Nonogram
[Try it out right here](https://sundwalltanner.github.io/React-Nonogram/)

## Description
This is currently in the very early stages of development. I haven't created anything that warranted the use of [GitHub Pages](https://pages.github.com/) yet, so I thought I would try and remake [the Nonogram game I built in Rust](https://github.com/Sundwalltanner/Rust-Nonogram).

## Controls
These are the default controls. There are currently only mouse controls, but I hope to add keyboard controls soon.

### Mouse controls
The mouse controls are fairly basic:
* ```Left Mouse Click``` - Fill box if clear. Clear box if not clear. Interact with buttons.
* ```Right Mouse Click``` - Mark box if clear. Clear box if not clear.

These two mouse buttons can also be held down in order to fill/clear multiple boxes. They will maintain the same command that was executed on the first box for convenience. This means that if you press the left mouse button and your cursor is hovering over a cleared box, as long as you keep that left mouse button held down, any other cleared box your cursor hovers over will be filled. Anything besides cleared boxes won't be altered.

This also means that commands are executed on mouse button down rather than on mouse button release.

### Interface
There's also a couple of buttons alongside the bottom of the board. These are in a very early stage of implementation in terms of appearance, but functionally they work as intended:

From left to right in order of appearance, the buttons are:
* ```Undo``` - Travel back to the previous board state.
* ```Redo``` - Travel forward to the next board state. Undo an undo.
* ```Restart``` - Wipe the board clean and generate a new random win state with a board size based on the dimensions in the box to the right of it.
* ```Dimensions Selection``` - A dropdown selection box with various board dimensions to choose from. In order to generate a board with these dimensions, hit the ```Restart``` button to the left of this box.

![Example of interface usage](https://i.imgur.com/6fbO36N.gif)

## How to play
There are numbers near each column and row of the board. These numbers indicate sequences of filled in blocks. For example, take a look at the image below:

![Example image of 5x5 solution](https://i.imgur.com/vPTTS1a.png)

This is the final solution to this particular Nonogram. From glancing at this, we can see that sequences of filled in boxes maintain the same order given by the order of the numbers nearby. We can also see that sequences of filled in boxes need at least one white box of separation. In order to assist you in remembering which boxes cannot be filled in, you can ```right click``` a box in order to mark it. You don't need to mark any boxes in order to win. They're just there to help you.

### Winning
The win condition is based entirely on which boxes you've filled in. Every time you fill or clear a box, the game checks to see if your board state matches that of the winning board. This takes into account the fact that some boards might not have a unique solution.

The progress tracker doesn't indicate correctness. You can fill an incorrect box, and it will still add that box to your progress.

You'll notice as you progress that the hint numbers will automatically change to a darker color. This indicates that the game thinks that particular sequence is taken care of. This exists in order to assist the player so they don't have to remember which sequences they've completed. 

Here's a gif of me solving a basic 5x5 Nonogram from start to finish:

![Gif of solving 5x5 Nonogram](https://i.imgur.com/0yIdX0Z.gif)

## Hopes and Dreams
By the end of development, I plan on implementing every feature from my original Nonogram game, and then some. The original game I made in Rust was limited by the game engine I was using to create it ([Piston](https://www.piston.rs/)). I hope to utilize React.js in order to overcome the challenges I faced with ```Piston``` and significantly improve upon my original creation.

## Current Status
At the moment, I have the very basics implemented:

* Mouse left and right clicks in order to fill and mark the board's squares.
* A timer keps track of the time that's elapsed since this instance of the page has been opened.
* An ```Undo``` button that travels reverts back to the board's state before the most recent action.
    * This is cool because this is already a feature I wanted to implement in the original game that I didn't get around to adding. This is based upon the basic [tic-tac-toe React tutorial](https://reactjs.org/tutorial/tutorial.html) in which the board states are saved in a ```history``` array.
* A ```Redo``` button that reverts an ```Undo``` by travelling forward into the board state's history if possible.
* A ```Restart``` button that resets the board state, and potentially produces a board with different dimensions from the previous board.
* A ```Dimensions Dropdown Selection Box``` that allows the user to select new ```columns```x```rows``` dimensions for the game board. These new dimensions will take effect upon board restart.
    * Some of the larger dimensions absolutely destroy the appearance of the board.
* ```Row and Column Hint Numbers``` that inform the user about the current sequences of filled in boxes on the game board. These are dynamic at the moment, as no goal state is being generated. Once a goal state is generated, these will by static and determined during the board's initialization.
    * These values are compared to the current state of the board and automatically faded to a different color in order to differentiate between hint numbers that the player has already dealt with, and hint numbers that the player hasn't yet dealt with.
    * The row hint numbers are great, but the column hint numbers are hacked together and aren't aligned all that well.
* Random win state generation and automatic check to see if player has met the win conditions.

## What are you still working on?
I'm still working on a bunch of stuff. Like I said, this is still in the very early stages of development.

### The basics
These are basically all the features I managed to implement in my Rust version. At the very least, I want to implement all of this:

* Win screen with stats.
    * Currently a message shows up beneath the timer announcing the player has won and that's it.
* Improved UI:
    * The current ```Undo``` button has no ```hover over``` animation. It should probably have this.
    * The current ```Redo``` button has no ```hover over``` animation. It should probably have this.
    * The current ```Restart``` button has no ```hover over``` animation. It should probably have this.
    * The current ```Dimensions Dropdown Selection Box``` looks ugly. It needs some CSS love.
* Keyboard controls.
    * Currently only mouse controls are implemented.
    * Need to implement the basic controls I had in the original Rust version:
        * ```WASD``` - Move to a different square on the board.
        * ```J``` - Fill box if clear. Clear box if not clear.
        * ```K``` - Mark box if clear. Clear box if not clear.
        * ```R``` - Restart.
        * ```U``` - Undo action.
    * Menu for editing keybindings.
* Save data.

### Stretch goals
Like with my Rust implementation, I've got some features I can add if I manage to hit all my basic goals:

* Allow image files to be read in and converted into a board goal state.
* Allow the user to play the color version as well. The ruleset of this is that there's basically more colors than black and white, hint numbers indicate color, and segments of different colors don't need whitespace to separate them. There's a lot more to it than that, and it would require quite a bit of work.
