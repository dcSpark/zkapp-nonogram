# Nonogram generator

This is a separate application to generate the input required for the zkApp contract

The separation is because zkApps need to have static lengths for arrays so the circuits have to be regenerated per nonogram. Therefore, the output of this program is then fed as a static in the zkApp

## Nonogram generation

You can put any nonogram you create in the `puzzles` folder.

Every pixel is a square in the nonogram. Transparency is used to indicate an empty square

You can generate a static constant using

```bash
npm run start -- --path puzzles/my-puzzle.png
```
