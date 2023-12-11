import { ONE, ZERO } from "@lib/constants";
import { Matrix } from "@lib/data-structures/matrix";
import { arraySum } from "@lib/math";

enum Entity {
  Galaxy = "#",
  None = ".",
}

type DayInputs = Matrix<Entity>;
type Coordinates = [number, number];

export default function main(inputs: DayInputs): number {
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

      const distance = getDistance(source, target);
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

  const starMap = new Matrix(
    normalized.flatMap((row) => {
      if (row.every((char) => char === Entity.None)) {
        return [row, row];
      }
      return [row];
    }),
  );

  columnsToDuplicate.forEach((column, index) => {
    starMap.insertColumn(column + index, [
      ...Entity.None.repeat(starMap.rows),
    ] as Entity[]);
  });

  return starMap;
}

function getDistance(
  [sourceRow, sourceColumn]: Coordinates,
  [targetRow, targetColumn]: Coordinates,
): number {
  return (
    Math.abs(targetRow - sourceRow) + Math.abs(targetColumn - sourceColumn)
  );
}
