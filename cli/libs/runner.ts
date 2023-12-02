import { readFile } from "node:fs/promises";

import inquirer from "inquirer";

import { ONE, ZERO } from "@lib/constants";

import type { SolutionModule } from "../../global";

export async function runner(
  inputPath: string,
  solutionPath: string,
): Promise<number> {
  const { solution, transform } = await import(solutionPath).then(
    (module: SolutionModule<unknown[]>) => ({
      solution: (transformedInputs: unknown[]) =>
        module.default(transformedInputs),
      transform: (rawInput: string[]) =>
        module.transformInput === undefined
          ? rawInput
          : module.transformInput(rawInput),
    }),
  );
  const rawValues = await readFile(inputPath, { encoding: "utf8" });
  const values = rawValues.trim().split("\n");

  if (values.length === ONE && values[ZERO].length === ZERO) {
    const { shouldRun } = await inquirer.prompt<{ shouldRun: boolean }>([
      {
        type: "confirm",
        name: "shouldRun",
        default: false,
        message:
          "It looks like there is no test input. Did you mean to run with zero inputs?",
      },
    ]);

    if (!shouldRun) {
      process.exit(ZERO);
    }
  }

  return solution(transform(values));
}
