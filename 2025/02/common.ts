import { ONE, ZERO } from "@lib/constants";

export function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + ONE }, (_, index) => start + index);
}

export const partOneRules: ((value: number) => boolean)[] = [isRepeatedTwice];
export const partTwoRules: ((value: number) => boolean)[] = [
  isAllSameCharacter,
  isRepeatedPattern,
];

function isRepeatedTwice(value: number): boolean {
  const TWO = 2;
  const numberString = value.toString();
  const start = [...numberString].slice(ZERO, numberString.length / TWO);
  const end = [...numberString].slice(numberString.length / TWO);
  return start.join("") === end.join("");
}

function isAllSameCharacter(value: number): boolean {
  const charSet = new Set(value.toString());

  return charSet.size === ONE && value.toString().length > ONE;
}

function isRepeatedPattern(value: number): boolean {
  const numberString = value.toString();
  const TWO = 2;

  for (let groupSize = TWO; groupSize < numberString.length; groupSize += ONE) {
    if (numberString.length % groupSize === ZERO) {
      const regexp = new RegExp(
        `^${`([0-9]{${groupSize}})`.repeat(numberString.length / groupSize)}$`,
      );
      const result = regexp.exec(numberString);
      const values = result ? [...result.values()].slice(ONE) : null;
      if (result && new Set(values).size === ONE) {
        return true;
      }
    }
  }
  return false;
}
