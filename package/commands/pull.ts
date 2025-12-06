import { Command } from "commander";
import inquirer from "inquirer";

import { logger } from "@lib/logger";

import { AoC } from "../api";
import { DECEMBER } from "../libs/constants";
import { dayArgument } from "../libs/inquisitor/arguments";
import { dayOption, forceOption, yearOption } from "../libs/inquisitor/options";
import { datePrompts } from "../libs/inquisitor/prompts";
import { openBrowser } from "../libs/node/child-process";
import { ChristmasError } from "../libs/oops/christmas-error";

import type { DatePrompt } from "../libs/inquisitor/prompts";

interface InitPrompt extends DatePrompt {
  force?: boolean;
  shouldGetInput?: boolean;
}

export const pullCommand = new Command("pull")
  .alias("p")
  .version("1.0.0")
  .description("download the input for the day")
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

    const optionsWithDate = await datePrompts(rawOptionCopy);

    const { year, day } = optionsWithDate;

    try {
      const api = new AoC(new Date(year, DECEMBER, day));

      await api.createInputFile({ force: true, fetch: true });

      const { shouldOpen } = await inquirer.prompt<{ shouldOpen: boolean }>([
        {
          name: "shouldOpen",
          default: false,
          type: "confirm",
          message: "Would you like the problem to be opened in your browser?",
        },
      ]);

      logger.frame(
        `Check out the problem at: ${api.problemUrl}
Get your input at: ${api.inputUrl}`,
      );

      if (shouldOpen) {
        openBrowser(api.problemUrl);
      }
    } catch (error) {
      if (error instanceof ChristmasError) {
        logger.error(error.message);
      } else {
        logger.error(error);
      }
    } finally {
      process.exit();
    }
  });
