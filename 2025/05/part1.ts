import { ONE, ZERO } from "@lib/constants";

interface DayInputs {
  available: number[];
  goodRanges: [number, number][];
}

export default function main(inputs: DayInputs): number {
  const { goodRanges: good, available } = inputs;
  let targetRangeIndex = ZERO;
  let count = ZERO;
  const usedRanges = [];

  available.forEach((id) => {
    let [min, max]: [number | undefined, number | undefined] =
      good[targetRangeIndex] ?? [];
    while (max !== undefined && id && max < id) {
      targetRangeIndex += ONE;
      [min, max] = good.at(targetRangeIndex) || [];
    }

    if (min === undefined || max === undefined) return;
    if (min <= id && id <= max) {
      usedRanges.push([min, max]);
      count += ONE;
    }
  });

  return count;
}

export function transformInput(inputs: string[]): DayInputs {
  const ingredients: DayInputs = {
    goodRanges: [],
    available: [],
  };
  const listSeparatorIndex = inputs.indexOf("");
  inputs.slice(ZERO, listSeparatorIndex).forEach((range) => {
    ingredients.goodRanges.push(
      range.split("-").map(Number) as [number, number],
    );
  });

  ingredients.available.push(
    ...inputs.slice(listSeparatorIndex + ONE).map(Number),
  );
  return {
    goodRanges: ingredients.goodRanges
      .sort(([aMin, aMax], [bMin, bMax]) => {
        if (aMin < bMin) return -ONE;
        if (aMin > bMin) return ONE;
        if (aMax < bMax) return -ONE;
        if (aMax > bMax) return ONE;
        return ZERO;
      })
      .reduce((good, [min, max]): [number, number][] => {
        const previous = good[good.length - ONE] as
          | [number, number]
          | undefined;
        if (!previous) return [...good, [min, max]];
        if (previous[ONE] >= min - ONE) {
          previous[ONE] = Math.max(previous[ONE], max);
          return good;
        }
        return [...good, [min, max]];
      }, []),
    available: ingredients.available.sort((a, b) => (a > b ? ONE : -ONE)),
  };
}
