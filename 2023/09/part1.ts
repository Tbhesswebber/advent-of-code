import { ONE, ZERO } from "@lib/constants";
import { arraySum } from "@lib/math";

type DayInputs = number[][];

export default function main(inputs: DayInputs): number {
  const nextValues: number[] = [];

  for (let index = ZERO; index < inputs.length; index += ONE) {
    const transforms: number[][] = [inputs[index]];
    let latestTransform = transforms.at(-ONE);

    while (
      latestTransform !== undefined &&
      latestTransform.some((value) => value !== ZERO)
    ) {
      transforms.push(
        latestTransform.reduce<number[]>(
          (agg, current, currentIndex, all): number[] => {
            if (currentIndex === ZERO) return agg;
            return [...agg, current - all[currentIndex - ONE]];
          },
          [],
        ),
      );
      latestTransform = transforms.at(-ONE);
    }

    const value = transforms.reduceRight(
      (previousTransformNewValue, currentTransform) => {
        const addend1 = currentTransform[currentTransform.length - ONE];
        const addend2 = previousTransformNewValue;
        return addend1 + addend2;
      },
      ZERO,
    );

    nextValues.push(value);
  }

  return arraySum(nextValues);
}

export function transformInput(inputs: string[]): DayInputs {
  return inputs.filter(Boolean).map((line) => line.split(" ").map(Number));
}
