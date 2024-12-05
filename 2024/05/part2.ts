import { ONE, ZERO } from "@lib/constants";
import { logger } from "@lib/logger";
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

  const invalidUpdates = updates
    .filter((update) => {
      return update.some((value, index) => {
        return update
          .slice(ZERO, index)
          .some(
            (previous) =>
              rulesByPageNumber[value] &&
              rulesByPageNumber[value].has(previous),
          );
      });
    })
    .map((update) => {
      return logger.log(
        update.sort((a, b) => {
          if (rulesByPageNumber[a] && rulesByPageNumber[a].has(b)) return ONE;
          if (rulesByPageNumber[b] && rulesByPageNumber[b].has(a)) return -ONE;
          return ZERO;
        }),
      );
    });

  const middleValues = invalidUpdates.map((update) => {
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
