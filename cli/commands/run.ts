import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";

import { Command } from "commander";
import inquirer from "inquirer";

import { dayArg as dayArgument } from "../arguments";
import { jsonify } from "../libs/format";
import { getInputPath, getSolutionPath } from "../libs/output";
import { dayOption, partOption, yearOption } from "../options";

import type { SolutionModule } from "../../global";

type Part = 1 | 2;

interface RunnerPrompt {
  day?: number;
  part?: Part;
  year?: number;
}

export const runCommand = new Command("run")
  .version("1.0.0")
  .addOption(yearOption)
  .addOption(dayOption)
  .addOption(partOption)
  .addArgument(dayArgument)
  .action(async (dayInput: number | undefined, rawOptions: RunnerPrompt) => {
    const rawOptionCopy = { ...rawOptions };
    if (dayInput !== undefined) {
      rawOptionCopy.year = new Date().getFullYear();
      rawOptionCopy.day = new Date().getDate();
    }

    const options = await inquirer.prompt<Required<RunnerPrompt>>(
      [
        {
          name: "year",
          message: "What year would you like to run?",
          default: new Date().getFullYear(),
          type: "number",
        },
        {
          name: "day",
          message: "What day would you like to run?",
          default: new Date().getDate(),
          type: "number",
        },
        {
          name: "part",
          message: "What question part would you like to run?",
          default: "1",
          choices: ["1", "2"],
          type: "list",
          validate(input) {
            return input === "1" || input === "2";
          },
        },
      ],
      rawOptionCopy,
    );

    const { year, part } = options;
    const dayLength = 2;
    const day = options.day.toString().padStart(dayLength, "0");

    const inputPath = getInputPath(year, day);
    const solutionPath = getSolutionPath(year, day, part);

    if (existsSync(solutionPath) && existsSync(inputPath)) {
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

      const result = solution(transform(values));

      console.log("");
      console.log(`Result: ${jsonify(result)}`);
      console.log("");
    } else {
      console.error("No file found matching the supplied parameters.");
    }
  });
