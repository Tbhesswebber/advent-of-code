import { readFile, writeFile } from "node:fs/promises";
import inquirer from "inquirer";
import { existsSync } from "node:fs";
import { dayOption, partOption, yearOption } from "../options";
import { dayArg } from "../arguments";
import { Command } from "commander";
import { getInputPath, getResultPath, getSolutionPath } from "../libs/output";

interface RunnerPrompt {
  year?: number;
  day?: number;
  part?: 1 | 2;
}

type Results = {
            part1: unknown;
            part2: unknown;
        };

export const runCommand = new Command("run")
    .version("1.0.0")
  .addOption(yearOption)
  .addOption(dayOption)
  .addOption(partOption)
  .addArgument(dayArg)
  .action(async (dayArg: undefined | number, rawOptions: RunnerPrompt) => {

    if (dayArg !== undefined) {
      rawOptions.year = new Date().getFullYear();
      rawOptions.day = new Date().getDate();
    }

    const options: Required<RunnerPrompt> = await inquirer.prompt(
      [
        {
          name: "year",
          message: "What year would you like to run?",
          default: new Date().getFullYear(),
          type: "number",
        },
        {
          name: "day",
          message: "What day would you like to run?",
          default: new Date().getDate(),
          type: "number",
        },
        {
          name: "part",
          message: "What question part would you like to run?",
          default: "1",
          choices: ["1", "2"],
          type: "list",
          validate(input) {
            return input === "1" || input === "2"
          }
        },
      ],
      rawOptions
    );

    const {year, part} = options;
    const day = options.day?.toString().padStart(2, "0");

    const inputPath = getInputPath(year, day);
    const solutionPath = getSolutionPath(year, day , part);
    const resultPath = getResultPath(year, day);

    if (existsSync(solutionPath) && existsSync(inputPath)) {
       const solution = await import(solutionPath).then(module => module.default);
       const values = (await readFile(inputPath, {"encoding": "utf-8"})).trim().split("\n");

       let results: Results;
       
       try {

           results = await import(resultPath).then((module) => module.default as Results);
       } catch {
        results = {part1: null, part2: null}
       }

       
       const result = solution(values);
       
       console.log("")
       console.log("Result: " + result)
       console.log("")
       
       results[`part${part}`] = result
       writeFile(resultPath, JSON.stringify(results, null, 2))
    } else {
        console.error("No file found matching the supplied parameters.")
    }
  });
