import { ONE, ZERO } from "@lib/constants";
import { arraySum } from "@lib/math";

type DayInputs = ReturnType<typeof transformInput>;

export default function main(inputs: DayInputs): number {
  const joltages = inputs
    .map((bank) => {
      return [...bank]
        .reduce(
          ([firstLargest, secondLargest], currentBattery, index) => {
            if (index === bank.length - ONE) {
              return [firstLargest, Math.max(secondLargest, +currentBattery)];
            }
            if (+currentBattery > firstLargest) {
              return [+currentBattery, ZERO];
            }
            return [firstLargest, Math.max(secondLargest, +currentBattery)];
          },
          [ZERO, ZERO],
        )
        .join("");
    })
    .map((joltage) => +joltage);

  return arraySum(joltages);
}

export function transformInput(inputs: string[]): string[] {
  return inputs;
}
