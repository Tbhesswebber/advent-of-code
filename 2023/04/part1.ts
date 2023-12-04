import { ONE, ZERO } from "@lib/constants";
import { arraySum } from "@lib/math";

type DayInputs = {
  cardNumbers: number[];
  id: string;
  winningNumbers: number[];
}[];

export default function main(inputs: DayInputs): number {
  const results = inputs
    .map(({ winningNumbers, cardNumbers }) =>
      cardNumbers.reduce((total, current) => {
        return total + Number(winningNumbers.includes(current));
      }, ZERO),
    )
    .map((winningNumberCount) =>
      winningNumberCount === ZERO
        ? ZERO
        : ONE * (ONE + ONE) ** (winningNumberCount - ONE),
    );

  return arraySum(results);
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
