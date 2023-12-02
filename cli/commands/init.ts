import { mkdir } from "node:fs/promises";

import { Command } from "commander";
import inquirer from "inquirer";

import { dayArg as dayArgument } from "../arguments";
import { Part } from "../constants";
import { writeFileIfNotExists } from "../libs/fs";
import {
  getInputPath,
  getOutputPath,
  getResultPath,
  getSolutionPath,
} from "../libs/output";
import { dayOption, forceOption, yearOption } from "../options";

interface InitPrompt {
  day?: number;
  force?: boolean;
  year?: number;
}

export const initCommand = new Command("init")
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
          message: "What year would you like to create files for?",
          default: new Date().getFullYear(),
          type: "number",
        },
        {
          name: "day",
          message: "What day would you like to create files for?",
          default: new Date().getDate(),
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
      writeFileIfNotExists(getInputPath(year, day), "", rawOptions.force),
      writeFileIfNotExists(getResultPath(year, day), "{}", rawOptions.force),
      writeFileIfNotExists(
        getSolutionPath(year, day, Part.One),
        "type DayInputs = string[];\n\nexport default function main(inputs: DayInputs): unknown {\n  return inputs;\n}\n\nexport function transformInput(inputs: string[]): DayInputs {\n  return inputs;\n}\n",
        rawOptions.force,
      ),
      writeFileIfNotExists(
        getSolutionPath(year, day, Part.Two),
        "type DayInputs = string[];\n\nexport default function main(inputs: DayInputs): unknown {\n  return inputs;\n}\n\nexport function transformInput(inputs: string[]): DayInputs {\n  return inputs;\n}\n",
        rawOptions.force,
      ),
    ]);
  });
