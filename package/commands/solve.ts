import { exec as execCallback } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

import { Command } from "commander";

import { logger } from "@lib/logger";

import { AoC } from "../api";
import { DECEMBER, Part } from "../libs/constants";
import { dayArgument } from "../libs/inquisitor/arguments";
import { dayOption, partOption, yearOption } from "../libs/inquisitor/options";
import { datePrompts } from "../libs/inquisitor/prompts";
import { ChristmasError } from "../libs/oops/christmas-error";
import { InputError } from "../libs/oops/input-error";

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

    const { year, day } = await datePrompts(rawOptionCopy);

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
