import { PNG } from "pngjs";
import { promises as fs } from "fs";
import { ColorUtils } from "./color";

export async function getSolution(path: string): Promise<bigint[][]> {
  const file = await fs.readFile(path);
  const png = PNG.sync.read(file);

  const result: bigint[][] = [];
  for (var y = 0; y < png.height; y++) {
    const row: bigint[] = [];
    for (var x = 0; x < png.width; x++) {
      var idx = (png.width * y + x) << 2;

      const [r, g, b, a] = [
        png.data[idx],
        png.data[idx + 1],
        png.data[idx + 2],
        png.data[idx + 3],
      ];
      if (a < 255) {
        row.push(ColorUtils.NO_COLOR);
      } else {
        row.push(BigInt((r << 16) + (g << 8) + b));
      }
    }
    result.push(row);
  }

  return result;
}
