import { ONE, ZERO } from "@lib/constants";

interface DayInputs {
  goodRanges: [number, number][];
}

export default function main(inputs: DayInputs): number {
  const { goodRanges: good } = inputs;
  let count = ZERO;

  console.log(good.map((v) => v.join("-")).join("\n"));

  good.forEach(([min, max]) => {
    count += max - min + ONE; // add an extra one because its inclusive
  });

  return count;
}

export function transformInput(inputs: string[]): DayInputs {
  const ingredients: DayInputs = {
    goodRanges: [],
  };
  const listSeparatorIndex = inputs.indexOf("");
  inputs.slice(ZERO, listSeparatorIndex).forEach((range) => {
    ingredients.goodRanges.push(
      range.split("-").map(Number) as [number, number],
    );
  });

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
  };
}
