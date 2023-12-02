import { ONE } from "@lib/constants";

import parser from "./part1";

type DayArguments = string[];

const numberStringToNumber: Record<string, string> = {
  zero: "0",
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
};

export default function main(inputs: DayArguments): number {
  const numberString =
    /(zero)|(one)|(two)|(three)|(four)|(five)|(six)|(seven)|(eight)|(nine)/g;
  const transformed = inputs.map((argument) =>
    argument
      .replaceAll(numberString, (match) => {
        return numberStringToNumber[match] + match.slice(ONE);
      })
      .replaceAll(numberString, (match) => {
        return numberStringToNumber[match] + match.slice(ONE);
      }),
  );

  return parser(transformed);
}
