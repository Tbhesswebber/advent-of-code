import { ONE, ZERO } from "@lib/constants";
import { arraySum } from "@lib/math";
import { isEven } from "@lib/number";

interface DayInputs {
  rules: [number, number][];
  updates: number[][];
}

export default function main({ rules, updates }: DayInputs): number {
  const rulesByPageNumber = rules.reduce<
    Record<number, Set<number> | undefined>
  >((rulesByPage, [key, value]) => {
    // eslint-disable-next-line no-param-reassign, @typescript-eslint/no-unnecessary-condition -- Better to not reassign with this size of data set
    rulesByPage[key] ??= new Set<number>();
    rulesByPage[key].add(value);
    return rulesByPage;
  }, {});

  const validUpdates = updates.filter((update) => {
    return update.every((value, index) => {
      return update
        .slice(ZERO, index)
        .every(
          (previous) =>
            !rulesByPageNumber[value] ||
            !rulesByPageNumber[value].has(previous),
        );
    });
  });

  const middleValues = validUpdates.map((update) => {
    if (isEven(update.length)) {
      throw new Error("Cannot find the middle value of an even length update");
    }
    return update[(update.length - ONE) / (ONE + ONE)];
  });
  return arraySum(middleValues);
}

export function transformInput(inputs: string[]): DayInputs {
  const breakIndex = inputs.indexOf("");
  const rules = inputs
    .slice(ZERO, breakIndex)
    .map((line) => line.split("|").map(Number) as [number, number]);
  const updates = inputs
    .slice(breakIndex + ONE)
    .map((line) => line.split(",").map(Number));
  return { rules, updates };
}
