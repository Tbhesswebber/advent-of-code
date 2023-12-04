import { inRange } from "lodash/fp";

import { ONE, ZERO } from "@lib/constants";

type Assignment = [number, number];
type DayInputs = [Assignment, Assignment][];

export default function main(inputs: DayInputs): number {
  const pairsWithOverlap = inputs.filter(
    ([elf1, elf2]) =>
      elf1.some((bound) => inRange(elf2[ZERO], elf2[ONE] + ONE, bound)) ||
      elf2.some((bound) => inRange(elf1[ZERO], elf1[ONE] + ONE, bound)),
  );

  return pairsWithOverlap.length;
}

export function transformInput(inputs: string[]): DayInputs {
  const tupleLength = 2;
  const normalized = inputs.map((input) =>
    input.split(",").map((elf) => elf.split("-").map(Number)),
  );

  if (
    normalized.every(
      (pair) =>
        pair.length === tupleLength &&
        pair.every((assignment) => assignment.length === tupleLength),
    )
  ) {
    return normalized as DayInputs;
  }

  throw new Error(`Could not be normalized correctly`);
}
