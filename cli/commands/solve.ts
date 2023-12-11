import { exec as execCallback } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

import { Command } from "commander";
import inquirer from "inquirer";

import { ONE, ZERO } from "@lib/constants";
import { logger } from "@lib/logger";

import { AoC } from "../api";
import { dayArgument } from "../libs/arguments";
import { DECEMBER, Part } from "../libs/constants";
import { getFolderContents } from "../libs/fs";
import { ChristmasError } from "../libs/oops/christmas-error";
import { InputError } from "../libs/oops/input-error";
import { dayOption, partOption, yearOption } from "../libs/options";

interface RunnerPrompt {
  day?: number;
  part?: Part;
  year?: number;
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

    const { year, day } = await inquirer.prompt<Required<RunnerPrompt>>(
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

    try {
      const api = new AoC(new Date(year, DECEMBER, day));
      await Promise.all([api.run(Part.One), api.run(Part.One)]);

      await api.saveResults();

      await exec(`git add ${api.folderPath}`, { cwd: __dirname });
      await exec(
        `git commit -m "solve(${year}): adds basic solution for day ${day}"`,
        { cwd: __dirname },
      );
    } catch (error) {
      if (error instanceof ChristmasError) {
        logger.error(error.message);
      } else if (error instanceof InputError) {
        logger.error(error.message);
      } else if (error instanceof Error) {
        logger.error(error.message);
        console.error(error.stack);
      } else {
        logger.error(
          "Something went wrong running the files with the given parameters.",
        );
        logger.error(error);
      }
    }
  });
