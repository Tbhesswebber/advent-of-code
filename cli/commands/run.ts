import { Command } from "commander";
import inquirer from "inquirer";

import { ONE, ZERO } from "@lib/constants";
import { logger } from "@lib/logger";

import { AoC } from "../api";
import { dayArgument } from "../arguments";
import { DECEMBER } from "../constants";
import { getFolderContents } from "../libs/fs";
import { InputError } from "../libs/oops/input-error";
import { dayOption, partOption, yearOption } from "../options";

import type { Part } from "../constants";

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

    const { year, day, part } = await inquirer.prompt<Required<RunnerPrompt>>(
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

    const { inputPath } = api;

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
