import { writeFile } from "node:fs/promises";
import { OUTPUT_PATH } from "../constants";
import { resolve } from "node:path";
import chalk from "chalk";

export async function writeFileIfNotExists(
  path: string,
  contents?: string | string[]
): Promise<unknown> {
  const normalizedPath = path.includes(OUTPUT_PATH)
    ? path
    : resolve(OUTPUT_PATH, path);

  return writeFile(normalizedPath, contents ?? "", { flag: "wx" }).catch(() => {
    console.log(chalk.red(`An error occurred creating the file at ${normalizedPath}`));
  });
}
