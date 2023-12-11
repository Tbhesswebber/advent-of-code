import { ONE, ZERO } from "@lib/constants";
import { Matrix } from "@lib/data-structures/matrix";
import { arraySum } from "@lib/math";

enum Entity {
  Galaxy = "#",
  None = ".",
}

interface DayInputs {
  duplicatedColumns: number[];
  duplicatedRows: number[];
  inputs: Matrix<Entity>;
}
type Coordinates = [number, number];

export default function main({
  inputs,
  duplicatedColumns,
  duplicatedRows,
}: DayInputs): number {
  const galaxyLocations: Coordinates[] = [];
  inputs.forEach((value, rowIndex, columnIndex) => {
    if (value === Entity.Galaxy) {
      galaxyLocations.push([rowIndex, columnIndex]);
    }
  });

  const galaxyDistances = new Map<Coordinates, Map<Coordinates, number>>();
  galaxyLocations.forEach((source, sourceIndex) => {
    galaxyLocations.slice(sourceIndex + ONE).forEach((target) => {
      galaxyDistances.set(
        source,
        galaxyDistances.get(source) ?? new Map<Coordinates, number>(),
      );
      const distance = getDistance(
        source,
        target,
        duplicatedRows,
        duplicatedColumns,
      );
      const sourceDistances = galaxyDistances.get(source);
      if (sourceDistances !== undefined && !sourceDistances.has(target)) {
        sourceDistances.set(target, distance);
      }
    });
  });

  return arraySum(
    [...galaxyDistances.values()].flatMap((targets) => [...targets.values()]),
  );
}

export function transformInput(inputs: string[]): DayInputs {
  const normalized = inputs.filter(Boolean).map((row) => [...row] as Entity[]);
  const rowsToDuplicate = normalized.reduce<number[]>(
    (duplicated, row, rowIndex) => {
      if (row.every((char) => char === Entity.None)) {
        return [...duplicated, rowIndex];
      }
      return duplicated;
    },
    [],
  );
  const columnsToDuplicate: number[] = [];

  for (let column = ZERO; column < normalized.length; column += ONE) {
    let shouldCopy = true;
    for (let row = ZERO; row < normalized[ZERO].length; row += ONE) {
      if (normalized[row][column] === Entity.Galaxy) {
        shouldCopy = false;
      }
    }
    if (shouldCopy) {
      columnsToDuplicate.push(column);
    }
  }

  const starMap = new Matrix(normalized);

  return {
    inputs: starMap,
    duplicatedColumns: columnsToDuplicate,
    duplicatedRows: rowsToDuplicate,
  };
}

function getDistance(
  [sourceRow, sourceColumn]: Coordinates,
  [targetRow, targetColumn]: Coordinates,
  duplicatedRows: number[],
  duplicatedColumns: number[],
): number {
  const duplicateRowsCrossed = duplicatedRows.filter(
    (row) => row > sourceRow && row < targetRow,
  );
  const duplicateColumnsCrossed = duplicatedColumns.filter(
    (column) =>
      (column > sourceColumn && column < targetColumn) ||
      (column < sourceColumn && column > targetColumn),
  );
  const million = 1_000_000;
  return (
    Math.abs(targetRow - sourceRow) +
    Math.abs(targetColumn - sourceColumn) +
    (duplicateRowsCrossed.length + duplicateColumnsCrossed.length) *
      // one million times larger means only an extra 999_999 rows/columns
      (million - ONE)
  );
}
