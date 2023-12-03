import { ONE, ZERO } from "@lib/constants";
import { arrayMultiply, arraySum } from "@lib/math";

type DayInputs = string[];

interface Part {
  endIndex: number | null;
  line: number;
  part: string;
  startIndex: number | null;
}

interface Location {
  line: number;
  space: number;
}

export default function main(inputs: DayInputs): number {
  const partNumberMetadata = inputs
    .map((line) => [...line])
    .reduce<Part[][]>((parts, line, lineIndex, lines) => {
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
        .reduce<{
          currentPart: {
            endIndex: number | null;
            line: number;
            part: string;
            startIndex: number | null;
          };
          parts: Part[];
        }>(
          (partNumbers, char, charIndex, chars) => {
            if (!char.symbolNeighbor) {
              return {
                parts:
                  partNumbers.currentPart.part === ""
                    ? partNumbers.parts
                    : [
                        ...partNumbers.parts,
                        {
                          ...partNumbers.currentPart,
                          endIndex: charIndex - ONE,
                        },
                      ],
                currentPart: {
                  part: "",
                  line: lineIndex,
                  startIndex: null,
                  endIndex: null,
                },
              };
            }

            if (charIndex + ONE === chars.length) {
              return {
                parts: [
                  ...partNumbers.parts,
                  {
                    ...partNumbers.currentPart,
                    part: partNumbers.currentPart.part + char.char,
                    endIndex: charIndex - ONE,
                  },
                ],
                currentPart: {
                  part: "",
                  line: lineIndex,
                  startIndex: null,
                  endIndex: null,
                },
              };
            }

            return {
              parts: partNumbers.parts,
              currentPart: {
                ...partNumbers.currentPart,
                part: partNumbers.currentPart.part + char.char,
                startIndex: partNumbers.currentPart.startIndex ?? charIndex,
                line: lineIndex,
              },
            };
          },
          {
            parts: [],
            currentPart: {
              part: "",
              line: 0,
              startIndex: null,
              endIndex: null,
            },
          },
        ).parts;

      return [...parts, currentLineParts];
    }, []);

  const results = inputs
    .map((line) => [...line])
    .reduce<Location[][][]>((parts, line, lineIndex, lines): Location[][][] => {
      const previousLine =
        lineIndex - ONE >= ZERO ? lines[lineIndex - ONE] : [];
      const nextLine =
        lineIndex + ONE < lines.length ? lines[lineIndex + ONE] : [];

      const currentLineGears = line
        .map(
          (
            char,
            charIndex,
            chars,
          ): { char: string; numberNeighbors: Location[] } => {
            if (isSymbol(char)) {
              const hasPreviousValue = charIndex - ONE >= ZERO;
              const previousIndex = charIndex - ONE;
              const hasNextValue = charIndex + ONE < chars.length;
              const nextIndex = charIndex + ONE;

              return {
                numberNeighbors: [
                  isNumberString(chars[previousIndex])
                    ? { line: lineIndex, space: previousIndex }
                    : undefined,
                  isNumberString(chars[nextIndex])
                    ? { line: lineIndex, space: nextIndex }
                    : undefined,
                  isNumberString(previousLine[charIndex])
                    ? { line: lineIndex - ONE, space: charIndex }
                    : undefined,
                  isNumberString(nextLine[charIndex])
                    ? { line: lineIndex + ONE, space: charIndex }
                    : undefined,
                  hasNextValue && isNumberString(previousLine[nextIndex])
                    ? { line: lineIndex - ONE, space: nextIndex }
                    : undefined,
                  hasNextValue && isNumberString(nextLine[nextIndex])
                    ? { line: lineIndex + ONE, space: nextIndex }
                    : undefined,
                  hasPreviousValue &&
                  isNumberString(previousLine[previousIndex])
                    ? { line: lineIndex - ONE, space: previousIndex }
                    : undefined,
                  hasPreviousValue && isNumberString(nextLine[previousIndex])
                    ? { line: lineIndex + ONE, space: previousIndex }
                    : undefined,
                ].filter((v): v is Location => !!v),
                char,
              };
            }
            return { numberNeighbors: [], char: "." };
          },
        )
        .filter(
          ({ char, numberNeighbors }) =>
            isSymbol(char) && numberNeighbors.length > ONE,
        )
        .map(({ numberNeighbors }) => numberNeighbors);

      return [...parts, currentLineGears];
    }, [])
    .map((line) => {
      return line
        .filter((gear) => gear.length > ONE)
        .map((gears) => {
          const partsMap = new Map<Part | undefined, string | undefined>();
          gears.forEach(({ line: partLine, space }) => {
            const part = partNumberMetadata[partLine].find(
              ({ startIndex, endIndex }) =>
                (startIndex ?? Number.POSITIVE_INFINITY) <= space &&
                (endIndex ?? Number.NEGATIVE_INFINITY) >= space,
            );

            partsMap.set(part, part?.part);
          });

          const partNumbers = [...partsMap.values()]
            .filter((v): v is string => v !== undefined)
            .map(Number);
          return partNumbers.length <= ONE ? ZERO : arrayMultiply(partNumbers);
        });
    });

  return arraySum(results.map((line) => arraySum(line)));
}

export function transformInput(inputs: string[]): DayInputs {
  return inputs;
}

function isSymbol(char = "."): boolean {
  return char[ZERO] === "*";
}

function isNumberString(char: string): boolean {
  return /\d/.test(char[ZERO]);
}
