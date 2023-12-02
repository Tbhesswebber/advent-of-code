import { ZERO } from "@lib/constants";
import { arraySum } from "@lib/math";

import { prioritizeItems, stringIntersection } from "./commons";

type DayInputs = { compartment1: string; compartment2: string }[];

export default function main(inputs: DayInputs): number {
  const result = inputs
    .map(({ compartment1, compartment2 }) =>
      stringIntersection(compartment1, compartment2),
    )
    .map((char, index) => {
      return prioritizeItems(char, index);
    });

  return arraySum(result);
}

export function transformInput(inputs: string[]): DayInputs {
  return inputs.map((input) => {
    const TWO = 2;
    const midpoint = input.length / TWO;

    return {
      compartment1: input.slice(ZERO, midpoint),
      compartment2: input.slice(midpoint),
    };
  });
}
