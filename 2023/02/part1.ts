import { ZERO } from "@lib/constants";
import { arraySum } from "@lib/math";

type DayInputs = {
  id: string;
  rounds: { blue: number; green: number; red: number }[];
}[];

export default function main(inputs: DayInputs): number {
  const maxBlocks = { red: 12, green: 13, blue: 14 };
  const result = inputs
    .map(({ id, rounds }) => ({
      id,
      rounds: rounds.reduce((current, { green, red, blue }) => ({
        red: Math.max(red, current.red),
        green: Math.max(green, current.green),
        blue: Math.max(blue, current.blue),
      })),
    }))
    .filter(
      ({ rounds: { red, green, blue } }) =>
        red <= maxBlocks.red &&
        green <= maxBlocks.green &&
        blue <= maxBlocks.blue,
    )
    .map(({ id }) => Number(id));

  return arraySum(result);
}

export function transformInput(inputs: string[]): DayInputs {
  const gameIdMatcher = /^Game (?<id>\d+):/;
  const colorMatcher = /(?<quantity>\d+) (?<color>\w+)/;
  return inputs.map((input) => {
    const guesses = input
      .replace(gameIdMatcher, "")
      .trim()
      .split(";")
      .map((guess) =>
        guess.split(",").reduce(
          (round, currentColor) => {
            const values = colorMatcher.exec(currentColor)?.groups;
            return {
              ...round,
              [values?.color as "blue" | "green" | "red"]:
                values?.quantity ?? ZERO,
            };
          },
          { red: 0, green: 0, blue: 0 },
        ),
      );

    return {
      id: gameIdMatcher.exec(input)?.groups?.id ?? "INVALID_ID",
      rounds: guesses,
    };
  });
}
