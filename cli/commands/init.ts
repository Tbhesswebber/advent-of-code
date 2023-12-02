import { mkdir } from "node:fs/promises";

import { Command } from "commander";
import inquirer from "inquirer";

import { ONE, ZERO } from "@lib/constants";

import { dayArgument } from "../arguments";
import { Part } from "../constants";
import { getFolderContents, writeFileIfNotExists } from "../libs/fs";
import {
  getInputPath,
  getOutputPath,
  getResultPath,
  getSolutionPath,
  getTestInputPath,
} from "../libs/output";
import { dayOption, forceOption, yearOption } from "../options";
import {
  emptyFileTemplate,
  emptyJsonFileTemplate,
  solutionFileTemplate,
} from "../templates";

interface InitPrompt {
  day?: number;
  force?: boolean;
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

    const { year, day } = await inquirer.prompt<Required<InitPrompt>>(
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
            return Number(contents.at(-ONE)) + ONE;
          },
          type: "number",
          filter(value: number) {
            const dayLength = 2;
            return value.toString().padStart(dayLength, "0");
          },
        },
      ],
      rawOptionCopy,
    );

    await mkdir(getOutputPath(year, day), { recursive: true });
    await Promise.all([
      writeFileIfNotExists(
        getInputPath(year, day),
        emptyFileTemplate,
        rawOptions.force,
      ),
      writeFileIfNotExists(
        getTestInputPath(year, day),
        emptyFileTemplate,
        rawOptions.force,
      ),
      writeFileIfNotExists(
        getResultPath(year, day),
        emptyJsonFileTemplate,
        rawOptions.force,
      ),
      writeFileIfNotExists(
        getSolutionPath(year, day, Part.One),
        solutionFileTemplate,
        rawOptions.force,
      ),
      writeFileIfNotExists(
        getSolutionPath(year, day, Part.Two),
        solutionFileTemplate,
        rawOptions.force,
      ),
    ]);
  });
