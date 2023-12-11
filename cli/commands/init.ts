import { Command } from "commander";
import inquirer from "inquirer";

import { ONE, ZERO } from "@lib/constants";
import { logger } from "@lib/logger";

import { AoC } from "../api";
import { dayArgument } from "../arguments";
import { DECEMBER } from "../constants";
import { getFolderContents } from "../libs/fs";
import { dayOption, forceOption, yearOption } from "../options";

interface InitPrompt {
  day?: number;
  force?: boolean;
  shouldGetInput?: boolean;
  year?: number;
}

export const initCommand = new Command("init")
  .version("1.0.0")
  .description("initialize the necessary files for the day")
  .addOption(yearOption)
  .addOption(dayOption)
  .addOption(forceOption)
  .addArgument(dayArgument)
  .action(async (dayInput: number | undefined, rawOptions: InitPrompt) => {
    const rawOptionCopy = { ...rawOptions };
    if (dayInput !== undefined) {
      rawOptionCopy.year = new Date().getFullYear();
      rawOptionCopy.day = new Date().getDate() + dayInput;
    }

    const { year, day, shouldGetInput } = await inquirer.prompt<
      Required<InitPrompt>
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
          message: "What day would you like to create files for?",
          async default(answers: Pick<InitPrompt, "year">) {
            const contents = await getFolderContents(
              answers.year?.toString() ?? "",
            );
            const sorted = contents.sort((a, b) => a.localeCompare(b));
            return Number(sorted.at(-ONE)) + ONE;
          },
          type: "number",
          filter(value: number) {
            const dayLength = 2;
            return value.toString().padStart(dayLength, "0");
          },
        },
        {
          name: "shouldGetInput",
          message: "Should we try to pull down the input for you?",
          type: "confirm",
          default: false,
        },
      ],
      rawOptionCopy,
    );

    const api = new AoC(new Date(year, DECEMBER, day));

    await api.setupFileStructure({
      force: rawOptions.force,
      fetch: shouldGetInput,
    });

    logger.frame(
      `Check out the problem at: ${api.problemUrl}
Get your input at: ${api.inputUrl}`,
    );

    const { shouldOpen } = await inquirer.prompt<{ shouldOpen: boolean }>([
      {
        name: "shouldOpen",
        default: false,
        type: "confirm",
        message: "Would you like the problem to be opened in your browser?",
      },
    ]);

    if (shouldOpen) {
      api.openProblemSite();
    }

    api.openIde();
  });
