import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import chalk from "chalk";

import { OUTPUT_PATH } from "../constants";

export async function writeFileIfNotExists(
  path: string,
  contents?: string[] | string,
  force = false,
): Promise<unknown> {
  const normalizedPath = path.includes(OUTPUT_PATH)
    ? path
    : resolve(OUTPUT_PATH, path);

  return writeFile(normalizedPath, contents ?? "", {
    flag: force ? undefined : "wx",
  })
    .then(() => {
      console.log(chalk.green(`Successfully created ${normalizedPath}`));
    })
    .catch(() => {
      console.log(chalk.red(`An error occurred creating ${normalizedPath}`));
    });
}
