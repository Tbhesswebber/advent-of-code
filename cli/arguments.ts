import { Argument } from "commander";

export const dayArg = new Argument(
  "[day]",
  "The english day to generate files for"
)
  .choices(["today", "tomorrow", "yesterday"])
  .argOptional()
  .argParser((value) => {
    if (value === "tomorrow") return 1;
    if (value === "yesterday") return -1;
    return 0;
  });
