import { ONE, ZERO } from "@lib/constants";
import { arraySum } from "@lib/math";

type DayInputs = {
  cardNumbers: number[];
  id: string;
  winningNumbers: number[];
}[];

export default function main(inputs: DayInputs): number {
  const cache: Record<string, number> = {};

  inputs.forEach(({ id, winningNumbers, cardNumbers }) => {
    // account for cards owned already
    cache[id] = cache[id] || ZERO;
    cache[id] += 1;

    const timesWon = cardNumbers.reduce((total, current) => {
      return total + Number(winningNumbers.includes(current));
    }, ZERO);
    Array.from(
      { length: timesWon },
      (_, index) => Number(id) + index + ONE,
    ).forEach((cardCopy) => {
      cache[cardCopy] = cache[cardCopy] || ZERO;
      cache[cardCopy] += cache[id];
    });
  });

  return arraySum(Object.values(cache));
}

export function transformInput(inputs: string[]): DayInputs {
  const match =
    /Card\s+(?<cardId>\d+):\s*(?<winningNumbers>(\d+\s*)+)\s*\|\s*(?<cardNumbers>(\d+\s*)+)/;
  return inputs.map((card) => {
    const parsed = match.exec(card);
    if (
      !parsed?.groups ||
      !parsed.groups.cardId ||
      !parsed.groups.winningNumbers ||
      !parsed.groups.cardNumbers
    ) {
      console.log(parsed?.groups);
      throw new Error(`Card "${card}" parsing failed.`);
    }
    return {
      id: parsed.groups.cardId,
      winningNumbers: parsed.groups.winningNumbers
        .trim()
        .split(/\s+/)
        .map((value) => Number(value.trim())),
      cardNumbers: parsed.groups.cardNumbers
        .trim()
        .split(/\s+/)
        .map((value) => Number(value.trim())),
    };
  });
}
