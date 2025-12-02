import { ONE, ZERO } from "@lib/constants";
import { logger } from "@lib/logger";
import { arraySum } from "@lib/math";

import { range, partTwoRules } from "./common";

type DayInputs = ReturnType<typeof transformInput>;

export default function main(inputs: DayInputs): number {
  const result: number[] = [];

  inputs.forEach((ids) => {
    let idCount = ZERO;
    const found: number[] = [];
    ids.forEach((value) => {
      if (partTwoRules.some((rule) => rule(value))) {
        result.push(value);
        idCount += ONE;
        found.push(value);
      }
    });
    logger.log(`Range: ${ids[ZERO]} -> ${ids.at(-ONE)} - ${idCount} patterns`);
    logger.log(`\tMatches: ${found.join(",")}`);
  });

  return arraySum(result);
}

export function transformInput(inputs: string[]): number[][] {
  return inputs
    .flatMap((line) => line.split(","))
    .map((input) =>
      input
        .trim()
        .split("-")
        .map((value) => Number.parseInt(value, 10)),
    )
    .map(([min, max]) => range(min, max));
}
