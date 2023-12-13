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
    if (compareLines(row, all.at(index + ONE))) {
      lineIndexes.push(index + ONE);
    }
  });

  return lineIndexes;
}

function identicalSiblingColumns(matrix: Pattern): number[] {
  const lineIndexes: number[] = [];
  matrix.forEachColumn((column, index, all) => {
    if (compareLines(column, all.at(index + ONE))) {
      lineIndexes.push(index + ONE);
    }
  });

  return lineIndexes;
}

function isSymmetryPoint(values: string[][], lineIndex: number): boolean {
  let previousIndex = lineIndex - ONE;
  let nextIndex = lineIndex;

  while (previousIndex >= ZERO && nextIndex < values.length) {
    if (!compareLines(values[previousIndex], values.at(nextIndex))) {
      return false;
    }
    previousIndex -= ONE;
    nextIndex += ONE;
  }

  return true;
}

function compareLines(line1: string[], line2?: string[]): boolean {
  return line1.join("") === (line2 || []).join("");
}
