import { ONE, ZERO } from "@lib/constants";
import { arraySum } from "@lib/math";

type DayInputs = ReturnType<typeof transformInput>;
const emptyBatteries: number[] = [
  ZERO,
  ZERO,
  ZERO,
  ZERO,
  ZERO,
  ZERO,
  ZERO,
  ZERO,
  ZERO,
  ZERO,
  ZERO,
  ZERO,
];
const ALLOWED_BATTERIES = 12;

export default function main(inputs: DayInputs): number {
  const joltages = inputs
    .map((bank) => {
      return [...bank]
        .reduce((batteries, currentBattery, index) => {
          let currentTarget = Math.min(ALLOWED_BATTERIES, bank.length - index);

          while (currentTarget > ZERO) {
            if (
              batteries[ALLOWED_BATTERIES - currentTarget] < +currentBattery
            ) {
              return [
                ...batteries.slice(ZERO, ALLOWED_BATTERIES - currentTarget),
                +currentBattery,
                ...emptyBatteries.slice(
                  ALLOWED_BATTERIES - currentTarget + ONE,
                ),
              ];
            }
            currentTarget -= ONE;
          }
          return batteries;
        }, emptyBatteries)
        .join("");
    })
    .map((joltage) => +joltage);

  return arraySum(joltages);
}

export function transformInput(inputs: string[]): string[] {
  return inputs;
}
