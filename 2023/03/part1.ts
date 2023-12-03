import { ONE, ZERO } from "@lib/constants";
import { arraySum } from "@lib/math";

type DayInputs = string[];

export default function main(inputs: DayInputs): number {
  const result = inputs
    .map((line) => [...line])
    .reduce<string[][]>((parts, line, lineIndex, lines): string[][] => {
      const previousLine =
        lineIndex - ONE >= ZERO ? lines[lineIndex - ONE] : [];
      const nextLine =
        lineIndex + ONE < lines.length ? lines[lineIndex + ONE] : [];
      const currentLineParts = line
        .map((char, charIndex, chars) => {
          if (isNumberString(char)) {
            const hasPreviousValue = charIndex - ONE >= ZERO;
            const previousIndex = charIndex - ONE;
            const hasNextValue = charIndex + ONE < chars.length;
            const nextIndex = charIndex + ONE;

            return {
              symbolNeighbor:
                isSymbol(chars[previousIndex]) ||
                isSymbol(chars[nextIndex]) ||
                isSymbol(previousLine[charIndex]) ||
                isSymbol(nextLine[charIndex]) ||
                (hasNextValue && isSymbol(previousLine[nextIndex])) ||
                (hasNextValue && isSymbol(nextLine[nextIndex])) ||
                (hasPreviousValue && isSymbol(previousLine[previousIndex])) ||
                (hasPreviousValue && isSymbol(nextLine[previousIndex])),
              char,
            };
          }
          return { symbolNeighbor: false, char: "." };
        })
        .reduce<{ char: string; symbolNeighbor: boolean }[]>(
          (all, current, charIndex, chars) => {
            const isPreviousCharTouching =
              charIndex - ONE > ZERO
                ? chars[charIndex - ONE].symbolNeighbor
                : false;
            const isNextCharTouching =
              charIndex + ONE < chars.length
                ? chars[charIndex + ONE].symbolNeighbor
                : false;
            return [
              ...all,
              {
                ...current,
                symbolNeighbor:
                  isNumberString(current.char) &&
                  (isPreviousCharTouching ||
                    isNextCharTouching ||
                    current.symbolNeighbor),
              },
            ];
          },
          [],
        )
        .reduceRight<{ char: string; symbolNeighbor: boolean }[]>(
          (all, current, charIndex, chars) => {
            const isPreviousCharTouching =
              charIndex - ONE > ZERO
                ? chars[charIndex - ONE].symbolNeighbor
                : false;
            const isNextCharTouching =
              charIndex + ONE < chars.length
                ? chars[charIndex + ONE].symbolNeighbor
                : false;
            return [
              ...all,
              {
                ...current,
                symbolNeighbor:
                  isNumberString(current.char) &&
                  (isPreviousCharTouching ||
                    isNextCharTouching ||
                    current.symbolNeighbor),
              },
            ];
          },
          [],
        )
        .reverse()
        .reduce<{ currentPart: string; parts: string[] }>(
          (partNumbers, char, charIndex, chars) => {
            if (!char.symbolNeighbor) {
              return {
                parts:
                  partNumbers.currentPart === ""
                    ? partNumbers.parts
                    : [...partNumbers.parts, partNumbers.currentPart],
                currentPart: "",
              };
            }

            if (charIndex + ONE === chars.length) {
              return {
                parts: [
                  ...partNumbers.parts,
                  partNumbers.currentPart + char.char,
                ],
                currentPart: "",
              };
            }

            return {
              parts: partNumbers.parts,
              currentPart: partNumbers.currentPart + char.char,
            };
          },
          { parts: [], currentPart: "" },
        ).parts;

      return [...parts, currentLineParts];
    }, [])
    .map((parts) => parts.map(Number));

  return arraySum(result.map((line) => arraySum(line)));
}

export function transformInput(inputs: string[]): DayInputs {
  return inputs;
}

function isSymbol(char = "."): boolean {
  return !isNumberString(char) && char[ZERO] !== ".";
}

function isNumberString(char: string): boolean {
  return /\d/.test(char[ZERO]);
}
