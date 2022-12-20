// /** Use this comment block to generate the JSON for a solution */
import { solutionColumns, solutionRows } from "./generator";
import { getSolution } from "./imageParser";
import minimist from "minimist";

var argv = minimist(process.argv.slice(2));

const path = argv.path;
if (path == null) {
  throw new Error(`Missing command line argument '-- --path'`);
}

console.log(`Generating nonogram streaks for ${path}`);
async function main() {
  const secretSolution = await getSolution(argv.path);
  const secretNonogram = {
    rows: solutionRows(secretSolution),
    columns: solutionColumns(secretSolution),
  };
  console.log(
    JSON.stringify(
      secretNonogram,
      (_key, value) => (typeof value === "bigint" ? value.toString() : value) // return everything else unchanged)
    )
  );
}

main();
