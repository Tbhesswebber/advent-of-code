import { Argument } from "commander";

import { ONE, ZERO } from "@lib/constants";

export const dayArgument = new Argument(
  "[day]",
  "The english day to generate files for",
)
  .choices(["today", "tomorrow", "yesterday"])
  .argOptional()
  .argParser((value) => {
    if (value === "tomorrow") return ONE;
    if (value === "yesterday") return -ONE;
    return ZERO;
  });
