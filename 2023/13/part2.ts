import { ONE, ZERO } from "@lib/constants";
import { Matrix } from "@lib/data-structures/matrix";
import { arraySum } from "@lib/math";

type DayInputs = Pattern[];

type Pattern = Matrix<string>;

export default function main(inputs: DayInputs): number {
  const scores = inputs.map((pattern) => {
    const maybeSymmetryRows = identicalSiblingRows(pattern);
    const horizontalMultiplier = 100;
    const symmetryRows = maybeSymmetryRows.filter((rowIndex) =>
      isSymmetryPoint(pattern.getRows(), rowIndex),
    );
    if (symmetryRows.length === ONE) {
      return symmetryRows[ZERO] * horizontalMultiplier;
    }
    if (symmetryRows.length > ONE) {
      throw new Error("There is more than one row for pattern.");
    }

    const maybeSymmetryColumns = identicalSiblingColumns(pattern);
    const symmetryColumns = maybeSymmetryColumns.filter((rowIndex) =>
      isSymmetryPoint(pattern.getColumns(), rowIndex),
    );
    if (symmetryColumns.length === ONE) {
      return symmetryColumns[ZERO];
    }
    if (symmetryColumns.length > ONE) {
      throw new Error("There is more than one column for pattern.");
    }
    return ZERO;
  });

  return arraySum(scores);
}

export function transformInput(inputs: string[]): DayInputs {
  const patternsDividers = inputs
    .map((line, index) => (line === "" ? index : Number.NaN))
    .filter((maybeIndex) => !Number.isNaN(maybeIndex))
    .map((lineIndex, index, indices) => {
      return index === indices.length - ONE
        ? undefined
        : [lineIndex + ONE, indices[index + ONE]];
    })
    .filter((coordinates): coordinates is [number, number] => !!coordinates);
  patternsDividers.unshift([ZERO, patternsDividers[ZERO][ZERO] - ONE]);

  const matrices: DayInputs = [];

  for (let index = ZERO; index < patternsDividers.length; index += ONE) {
    const currentPattern = inputs.slice(...patternsDividers[index]);
    if (currentPattern.length > ZERO) {
      const matrix = new Matrix<string>(currentPattern.map((row) => [...row]));
      matrices.push(matrix);
    }
  }

  return matrices;
}

function identicalSiblingRows(matrix: Pattern): number[] {
  const lineIndexes: number[] = [];
  matrix.forEachRow((row, index, all) => {
    if (compareLinesOffByOneOrZero(row, all.at(index + ONE))) {
      lineIndexes.push(index + ONE);
    }
  });

  return lineIndexes;
}

function identicalSiblingColumns(matrix: Pattern): number[] {
  const lineIndexes: number[] = [];
  matrix.forEachColumn((column, index, all) => {
    if (compareLinesOffByOneOrZero(column, all.at(index + ONE))) {
      lineIndexes.push(index + ONE);
    }
  });

  return lineIndexes;
}

function isSymmetryPoint(values: string[][], lineIndex: number): boolean {
  let previousIndex = lineIndex - ONE;
  let nextIndex = lineIndex;
  let smudges = ZERO;

  while (previousIndex >= ZERO && nextIndex < values.length) {
    const differences = getLineDifferences(
      values[previousIndex],
      values[nextIndex],
    );
    if (differences > ONE || smudges > ONE) {
      return false;
    }

    smudges += differences;
    previousIndex -= ONE;
    nextIndex += ONE;
  }

  return smudges === ONE;
}

function compareLinesOffByOneOrZero(
  line1: string[],
  line2: string[] = [],
): boolean {
  return getLineDifferences(line1, line2) <= ONE;
}

function getLineDifferences(line1: string[], line2: string[] = []): number {
  let differences = ZERO;
  line1.forEach((character, index) => {
    differences += Number(character !== line2[index]);
  });
  return differences;
}
