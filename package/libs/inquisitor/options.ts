import { Option } from "commander";

export const yearOption = new Option(
  "-y, --year <number>",
  "the year of AOC to run",
).argParser(Number);

export const dayOption = new Option(
  "-d, --day <number>",
  "the day of AOC to run",
).argParser(Number);

export const partOption = new Option(
  "-p, --part <1 | 2>",
  "the question part to run",
)
  .argParser(Number)
  .choices(["1", "2"]);

export const forceOption = new Option(
  "-f, --force",
  "whether or not to force the operation",
);

export const inputFileNameOption = new Option(
  "-i, --inputFile <string>",
  "the input file name to use - must be within the directory for that day",
);
