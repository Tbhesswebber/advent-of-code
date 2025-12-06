import { Command } from "commander";
import inquirer from "inquirer";

import { logger } from "@lib/logger";

import { AoC } from "../api";
import { DECEMBER, RUNTIME_BEFORE_IDLE } from "../libs/constants";
import { dayArgument } from "../libs/inquisitor/arguments";
import {
  dayOption,
  inputFileNameOption,
  partOption,
  yearOption,
} from "../libs/inquisitor/options";
import { datePrompts } from "../libs/inquisitor/prompts";
import { report } from "../libs/node/child-process";
import { getTestInputPath } from "../libs/node/path";
import { ChristmasError } from "../libs/oops/christmas-error";
import { InputError } from "../libs/oops/input-error";

import type { Optionally } from "../../global";
import type { Part } from "../libs/constants";

interface RunnerPrompt {
  day?: number;
  inputFile?: string;
  part?: Part;
  year?: number;
}

export const testCommand = new Command("test")
  .alias("t")
  .version("1.0.0")
  .description(
    "run the code for the day against `testInput.txt` rather than the actual input",
  )
  .addOption(yearOption)
  .addOption(dayOption)
  .addOption(partOption)
  .addOption(inputFileNameOption)
  .addArgument(dayArgument)
  .action(async (dayInput: number | undefined, rawOptions: RunnerPrompt) => {
    const startStamp = new Date();
    const rawOptionCopy = { ...rawOptions };
    if (dayInput !== undefined) {
      rawOptionCopy.year = new Date().getFullYear();
      rawOptionCopy.day = new Date().getDate() + dayInput;
    }

    const optionsWithDate = await datePrompts(rawOptionCopy);

    const { year, day, part, inputFile } = await inquirer.prompt<
      Optionally<RunnerPrompt, "inputFile">
    >(
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

      const inputPath =
        inputFile === undefined
          ? api.testInputPath
          : getTestInputPath(year, day, inputFile);
      const result = await api.run(part, inputPath);
      logger.frame(`Result: ${result}`);

      if (Date.now() - startStamp.getTime() > RUNTIME_BEFORE_IDLE) {
        report([
          `AoC ${year} day ${day}, part ${part} has completed!`,
          `The result is ${result}`,
        ]);
      }
      process.exit();
    } catch (error) {
      if (error instanceof ChristmasError) {
        logger.error(error.message);
      } else if (error instanceof InputError) {
        logger.error(error.message);
      } else if (error instanceof Error) {
        logger.error(error.message);
        console.error(error);
      } else {
        logger.error(
          "Something went wrong running the files with the given parameters.",
        );
        logger.error(error);
      }
      if (Date.now() - startStamp.getTime() > RUNTIME_BEFORE_IDLE) {
        report([
          `Christmas is in danger!`,
          `AoC ${year} day ${day}, part ${part} has errored!`,
        ]);
      }
    } finally {
      process.exit();
    }
  });
