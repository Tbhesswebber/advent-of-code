import { exec as execCallback } from "node:child_process";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

import { Command } from "commander";
import inquirer from "inquirer";

import { ONE, ZERO } from "@lib/constants";
import { logger } from "@lib/logger";

import { dayArgument } from "../arguments";
import { Part } from "../constants";
import { jsonify } from "../libs/format";
import { getFolderContents } from "../libs/fs";
import {
  getInputPath,
  getOutputPath,
  getResultPath,
  getSolutionPath,
} from "../libs/output";
import { runner } from "../libs/runner";
import { dayOption, partOption, yearOption } from "../options";

interface RunnerPrompt {
  day?: number;
  part?: Part;
  year?: number;
}

interface Results {
  part1: unknown;
  part2: unknown;
}

// eslint-disable-next-line no-underscore-dangle, @typescript-eslint/naming-convention -- mimicking the dirname global
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const exec = promisify(execCallback);

export const solveCommand = new Command("solve")
  .version("1.0.0")
  .description(
    "rerun the code for the day, storing the output to a file within the day's directory and then commit the directory",
  )
  .addOption(yearOption)
  .addOption(dayOption)
  .addOption(partOption)
  .addArgument(dayArgument)
  .action(async (dayInput: number | undefined, rawOptions: RunnerPrompt) => {
    const rawOptionCopy = { ...rawOptions };
    if (dayInput !== undefined) {
      rawOptionCopy.year = new Date().getFullYear();
      rawOptionCopy.day = new Date().getDate() + dayInput;
    }

    const options = await inquirer.prompt<Required<RunnerPrompt>>(
      [
        {
          name: "year",
          message: "What year would you like to run?",
          async default() {
            const contents = await getFolderContents("");
            return contents
              .filter((name) => /^\d{4}$/.test(name))
              .sort((a, b) => Number(b) - Number(a))
              .at(ZERO);
          },
          type: "list",
          async choices() {
            const contents = await getFolderContents("");
            return contents
              .filter((name) => /^\d{4}$/.test(name))
              .sort((a, b) => Number(b) - Number(a));
          },
        },
        {
          name: "day",
          message: "What day would you like to run?",
          async default(answers: Pick<RunnerPrompt, "year">) {
            const contents = await getFolderContents(
              answers.year?.toString() ?? "",
            );
            return contents.at(-ONE);
          },
          type: "list",
          async choices(answers) {
            return getFolderContents(answers.year.toString());
          },
        },
      ],
      rawOptionCopy,
    );

    const { year } = options;
    const dayLength = 2;
    const day = options.day.toString().padStart(dayLength, "0");

    const inputPath = getInputPath(year, day);
    const solution1Path = getSolutionPath(year, day, Part.One);
    const solution2Path = getSolutionPath(year, day, Part.Two);
    const resultPath = getResultPath(year, day);

    try {
      const [result1, result2] = await Promise.all([
        runner(inputPath, solution1Path),
        runner(inputPath, solution2Path),
      ]);

      let results: Results;

      try {
        results = await import(resultPath).then(
          (module: { default: Results }) => module.default,
        );
      } catch {
        results = { part1: null, part2: null };
      }

      results.part1 = result1;
      results.part2 = result2;
      await writeFile(resultPath, jsonify(results));

      await exec(`git add ${getOutputPath(year, day)}`, { cwd: __dirname });
      await exec(
        `git commit -m "solve(${year}): adds basic solution for day ${day}"`,
        { cwd: __dirname },
      );
    } catch (error) {
      logger.error(
        "Something went wrong running the files with the given parameters.\n",
      );

      logger.error(error);
    }
  });
