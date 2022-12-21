# zkapp-nonogram

[Try it out right here](TODO)

## Description

Nonograms, also known as Hanjie, Paint by Numbers, Picross, Griddlers, and Pic-a-Pix, and by various other names, are picture logic puzzles in which cells in a grid must be colored or left blank according to numbers at the side of the grid to reveal a hidden pixel art-like picture.

Learn more [on Wikipedia](https://en.wikipedia.org/wiki/Nonogram) and [this video](https://www.youtube.com/watch?v=GEoXerHCQS0)

# Difficulties

- Can't use Lagrange polynomials to encode the solution as-is as there may be multiple valid solutions to a nonogram
- Dynamic arrays are needed for two reasons:
  1. Streaks may be of variable length (ex: one row may be [2,4,6], but another row maybe [2,2,1,1])
  2. We can't encode streaks of 0 in the circuit, or that would give the solution just by reading out the circuit
- Circuit limit can't encode large picture

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

# Future work

We may be able to support larger grids by using recursive circuits

# How to build

Note that `solution.ts` is missing. This is because if we uploaded the solution to Github, it would defeat the point!

However, you can find a `testSolutions.ts` file with a few different tests you can play around with
