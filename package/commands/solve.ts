import { Command } from "commander";

import { logger } from "@lib/logger";

import { AoC } from "../api";
import { DECEMBER, Part, RUNTIME_BEFORE_IDLE } from "../libs/constants";
import { dayArgument } from "../libs/inquisitor/arguments";
import { dayOption, partOption, yearOption } from "../libs/inquisitor/options";
import { datePrompts } from "../libs/inquisitor/prompts";
import { exec, report } from "../libs/node/child-process";
import { ChristmasError } from "../libs/oops/christmas-error";
import { InputError } from "../libs/oops/input-error";

interface RunnerPrompt {
  day?: number;
  part?: Part;
  year?: number;
}

// eslint-disable-next-line no-underscore-dangle, @typescript-eslint/naming-convention -- using Bun build-in to approximate the node equivalent
const __dirname = import.meta.dir;

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
    const startStamp = new Date();
    const rawOptionCopy = { ...rawOptions };
    if (dayInput !== undefined) {
      rawOptionCopy.year = new Date().getFullYear();
      rawOptionCopy.day = new Date().getDate() + dayInput;
    }

    const { year, day } = await datePrompts(rawOptionCopy);

    try {
      const api = new AoC(new Date(year, DECEMBER, day));
      await Promise.all([api.run(Part.One), api.run(Part.Two)]);

      await api.saveResults();

      exec(["git", "add", api.folderPath], { cwd: __dirname, sync: true });
      exec(
        [
          `git`,
          `commit`,
          `-m "solve(${year}): adds basic solution for day ${day}"`,
        ],
        { cwd: __dirname, sync: true },
      );

      if (Date.now() - startStamp.getTime() > RUNTIME_BEFORE_IDLE) {
        report([
          `AoC ${year} day ${day} is solved!`,
          "The results have been processed and solution saved to git!",
          "Don't forget to push your progress!",
          "",
          "Merry Christmas!",
        ]);
      } else {
        logger.log(
          [
            `AoC ${year} day ${day} is solved!`,
            "The results have been processed and solution saved to git!",
            "Don't forget to push your progress!",
            "",
            "Merry Christmas!",
          ].join("\n"),
        );
      }
      process.exit();
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
      if (Date.now() - startStamp.getTime() > RUNTIME_BEFORE_IDLE) {
        report([
          `Christmas is in danger!`,
          `AoC ${year} day ${day} has errored!`,
        ]);
      }
    }
  });
