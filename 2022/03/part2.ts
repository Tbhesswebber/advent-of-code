import { ONE, ZERO } from "@lib/constants";
import { arraySum } from "@lib/math";

import { prioritizeItems, stringIntersection } from "./commons";

type DayInputs = string[];

export default function main(inputs: DayInputs): number {
  const groupSize = 3;
  const result: number[] = [];

  for (let elf = ZERO; elf < inputs.length; elf += groupSize) {
    const compareFirstTwo = stringIntersection(inputs[elf], inputs[elf + ONE]);

    const intersection = stringIntersection(
      compareFirstTwo,
      inputs[elf + ONE + ONE],
    );

    result.push(prioritizeItems(intersection, elf / groupSize));
  }

  return arraySum(result);
}

export function transformInput(inputs: string[]): DayInputs {
  return inputs;
}
