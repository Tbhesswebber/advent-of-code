import { Command } from "commander";
import inquirer from "inquirer";

import { ONE, ZERO } from "@lib/constants";
import { logger } from "@lib/logger";

import { AoC } from "../api";
import { dayArgument } from "../libs/arguments";
import { DECEMBER } from "../libs/constants";
import { getFolderContents } from "../libs/fs";
import { InputError } from "../libs/oops/input-error";
import { getTestInputPath } from "../libs/output";
import {
  dayOption,
  inputFileNameOption,
  partOption,
  yearOption,
} from "../libs/options";

import type { Optionally } from "../../global";

type Part = 1 | 2;

interface RunnerPrompt {
  day?: number;
  inputFile?: string;
  part?: Part;
  year?: number;
}

export const testCommand = new Command("test")
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
    const rawOptionCopy = { ...rawOptions };
    if (dayInput !== undefined) {
      rawOptionCopy.year = new Date().getFullYear();
      rawOptionCopy.day = new Date().getDate() + dayInput;
    }

    const { year, day, part, inputFile } = await inquirer.prompt<
      Optionally<RunnerPrompt, "inputFile">
    >(
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
    const api = new AoC(new Date(year, DECEMBER, day));

    const inputPath =
      inputFile === undefined
        ? api.testInputPath
        : getTestInputPath(year, day, inputFile);

    try {
      const result = await api.run(part, inputPath);
      logger.frame(`Result: ${result}`);
    } catch (error) {
      if (error instanceof InputError) {
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
