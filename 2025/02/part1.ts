import { arraySum } from "@lib/math";

import { range, partOneRules } from "./common";

type DayInputs = ReturnType<typeof transformInput>;

export default function main(inputs: DayInputs): number {
  const result: number[] = [];

  inputs.flat().forEach((value) => {
    if (partOneRules.some((rule) => rule(value))) {
      result.push(value);
    }
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
