import { ONE, ZERO } from "@lib/constants";
import { arraySum } from "@lib/math";

type DayInputs = (number | undefined)[];

export default function main(inputs: DayInputs): number {
  const topElfCount = 3;
  return inputs
    .reduce<{ elfStart: number; elves: number[][] }>(
      (
        { elfStart, elves },
        calories,
        index,
        all,
      ): { elfStart: number; elves: number[][] } => {
        if (all.length - ONE === index) {
          const currentElf = all.slice(elfStart) as number[];
          return {
            elfStart: index + ONE,
            elves: [...elves, currentElf.length === ZERO ? [ZERO] : currentElf],
          };
        }

        if (calories === undefined) {
          const currentElf = all.slice(elfStart, index) as number[];
          return {
            elfStart: index + ONE,
            elves: [...elves, currentElf.length === ZERO ? [ZERO] : currentElf],
          };
        }

        return { elfStart, elves };
      },
      {
        elfStart: 0,
        elves: [],
      },
    )

    .elves.map((elf) => arraySum(elf))
    .sort((a, b) => b - a)
    .slice(ZERO, topElfCount)
    .reduce((sum: number, value: number) => sum + value);
}

export function transformInput(inputs: string[]): DayInputs {
  return inputs.map((input) => {
    const value = Number.parseInt(input, 10);
    return Number.isNaN(value) ? undefined : value;
  });
}
