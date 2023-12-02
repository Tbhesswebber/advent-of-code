import { Command } from "commander";
import { mkdir } from "node:fs/promises";
import inquirer from "inquirer";
import { dayOption, yearOption } from "../options";
import { writeFileIfNotExists } from "../libs/fs";
import { dayArg } from "../arguments";
import { getInputPath, getOutputPath, getResultPath, getSolutionPath } from "../libs/output";

interface InitPrompt {
  year?: number;
  day?: number;
}

export const initCommand = new Command("init")
  .description("initialize the necessary files for the day")
  .addOption(yearOption)
  .addOption(dayOption)
  .addArgument(dayArg)
  .action(
    async (dayArg: undefined | number, rawOptions: InitPrompt) => {

      if (dayArg !== undefined) {
        rawOptions.year = new Date().getFullYear();
        rawOptions.day = new Date().getDate() + dayArg;
      }

      const { year, day }: Required<InitPrompt> = await inquirer.prompt(
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
              return value.toString().padStart(2, "0")
            }
          },
        ],
        rawOptions
      );

      await mkdir(getOutputPath(year, day), { recursive: true });
      await Promise.all([
        writeFileIfNotExists(getInputPath(year, day)),
        writeFileIfNotExists(getResultPath(year, day), "{}"),
        writeFileIfNotExists(
          getSolutionPath(year, day, 1),
          "type DayArgs = string[]; \n\nexport default function main(args: DayArgs) {\n\n}"
        ),
        writeFileIfNotExists(
          getSolutionPath(year, day, 2),
          "type DayArgs = string[];\n\nexport default function main(args: DayArgs) {\n\n}"
        ),
      ]);
    }
  );
