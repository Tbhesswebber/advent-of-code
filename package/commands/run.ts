import { Command } from "commander";
import inquirer from "inquirer";

import { logger } from "@lib/logger";

import { AoC } from "../api";
import { DECEMBER } from "../libs/constants";
import { dayArgument } from "../libs/inquisitor/arguments";
import { dayOption, partOption, yearOption } from "../libs/inquisitor/options";
import { datePrompts } from "../libs/inquisitor/prompts";
import { ChristmasError } from "../libs/oops/christmas-error";
import { InputError } from "../libs/oops/input-error";

import type { Part } from "../libs/constants";

interface RunnerPrompt {
  day?: number;
  part?: Part;
  year?: number;
}

export const runCommand = new Command("run")
  .version("1.0.0")
  .description("run the code for a specified day")
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

    const optionsWithDate = await datePrompts(rawOptionCopy);

    const { year, day, part } = await inquirer.prompt<Required<RunnerPrompt>>(
      [
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
      optionsWithDate,
    );

    try {
      const api = new AoC(new Date(year, DECEMBER, day));

      const { inputPath } = api;

      const result = await api.run(part, inputPath);
      logger.frame(`Result: ${result}`);
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
