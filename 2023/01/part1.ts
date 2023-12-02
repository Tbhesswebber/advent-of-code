import { ONE, ZERO } from "@lib/constants";

type DayArguments = string[];

export default function main(input: DayArguments): number {
  const numberChar = /^\d$/;
  return input
    .map((argument, index) => {
      const numericChars = [...argument].filter((char) =>
        numberChar.test(char),
      );
      const calibrationValue = Number.parseInt(
        `${numericChars[ZERO]}${numericChars.at(-ONE)}`,
        10,
      );
      if (!calibrationValue || typeof calibrationValue !== "number") {
        console.log({ arg: argument, i: index });
      }
      return calibrationValue;
    })
    .reduce((sum, value) => sum + value);
}
