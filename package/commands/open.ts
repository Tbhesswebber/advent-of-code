import { openInEditor } from "bun";
import { Command } from "commander";
import inquirer from "inquirer";

import { logger } from "@lib/logger";

import { AoC } from "../api";
import { DECEMBER } from "../libs/constants";
import { dayArgument } from "../libs/inquisitor/arguments";
import { dayOption, yearOption } from "../libs/inquisitor/options";
import { datePrompts } from "../libs/inquisitor/prompts";
import { openBrowser } from "../libs/node/child-process";
import { ChristmasError } from "../libs/oops/christmas-error";

import type { DatePrompt } from "../libs/inquisitor/prompts";

interface OpenPrompt extends DatePrompt {
  editor?: boolean;
  web?: boolean;
}

export const openCommand = new Command("open")
  .alias("o")
  .version("1.0.0")
  .description("open all or some of the useful apps for the day")
  .addOption(yearOption)
  .addOption(dayOption)
  .option("-w, --web", "open the default browser to the problem for the day")
  .option("-e, --editor", "open the default IDE to the problem for the day")
  .addArgument(dayArgument)
  .action(async (dayInput: number | undefined, rawOptions: OpenPrompt) => {
    const rawOptionCopy = { ...rawOptions };
    if (dayInput !== undefined) {
      rawOptionCopy.year = new Date().getFullYear();
      rawOptionCopy.day = new Date().getDate() + dayInput;
    }

    const optionsWithDate = await datePrompts(rawOptionCopy);

    const {
      year,
      day,
      web: shouldOpenBrowser,
      editor: shouldOpenIde,
    } = await inquirer.prompt<Required<OpenPrompt>>(
      [
        {
          name: "web",
          message: "Open a browser?",
          type: "confirm",
          default: true,
          when: rawOptionCopy.editor !== true,
        },
        {
          name: "editor",
          message: "Open your IDE?",
          type: "confirm",
          default: true,
          when: rawOptionCopy.web !== true,
        },
      ],
      optionsWithDate,
    );

    try {
      const api = new AoC(new Date(year, DECEMBER, day));

      if (shouldOpenIde) {
        openInEditor(api.part1SolutionPath);
      }
      if (shouldOpenBrowser) {
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
