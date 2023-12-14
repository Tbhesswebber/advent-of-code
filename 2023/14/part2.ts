import { BILLION, ONE, ZERO } from "@lib/constants";
import { Matrix } from "@lib/data-structures/matrix";
import { log } from "@lib/logger";

import type { Coordinate } from "@lib/data-structures/matrix";

type DayInputs = Matrix<Rocks>;

enum Rocks {
  Round = "O",
  Cube = "#",
  None = ".",
}

enum Direction {
  North,
  West,
  South,
  East,
}

const directions = [
  Direction.North,
  Direction.West,
  Direction.South,
  Direction.East,
];

export default function main(inputs: DayInputs): number {
  const totalCycles = BILLION;
  const cache: Record<string, number | undefined> = {};
  const stopCount = 2;

  for (let cycle = ZERO; cycle < totalCycles; cycle += ONE) {
    const cacheKey = inputs.toString();
    if (typeof cache[cacheKey] === "number") {
      log(
        `Cache hit ${
          cache[cacheKey]
        } time(s)! Cycle: ${cycle} -- Load: ${checkLoadNorth(inputs)}`,
      );
      if (cache[cacheKey] === stopCount) {
        const entries = Object.entries(cache);
        const states = entries
          .filter(([, count]) => count === stopCount)
          .map(([key]) => new Matrix(JSON.parse(key) as Rocks[][]));

        return checkLoadNorth(
          states[
            (totalCycles - entries.length - states.length) % states.length
          ],
        );
      }

      cache[cacheKey] = (cache[cacheKey] ?? ZERO) + ONE;
    } else {
      cache[cacheKey] = ONE;
      log(`Cache miss! Cycle: ${cycle} -- Load: ${checkLoadNorth(inputs)}`);
    }

    for (
      let directionIndex = ZERO;
      directionIndex < directions.length;
      directionIndex += ONE
    ) {
      const direction = directions[directionIndex];

      let shifts: number;
      do {
        shifts = ZERO;
        // eslint-disable-next-line no-loop-func -- need access to the shifts variable
        inputs.forEach((value, rowIndex, columnIndex, _, data): void => {
          const nextLocation = getShiftLocation(direction, [
            rowIndex,
            columnIndex,
          ]);
          if (!data.isInRange(nextLocation) || !canRoll(value)) return;
          const nextSpace = data.get(...nextLocation);

          if (isEmptySpace(nextSpace)) {
            data.set(...nextLocation, value);
            data.set(rowIndex, columnIndex, Rocks.None);
            shifts += ONE;
          }
        });
      } while (shifts !== ZERO);
    }
  }

  log(inputs.toString(true));

  return checkLoadNorth(inputs);
}

export function transformInput(inputs: string[]): DayInputs {
  return new Matrix(inputs.filter(Boolean).map((line) => [...line] as Rocks[]));
}

function canRoll(value: Rocks): value is Rocks.Round {
  return value === Rocks.Round;
}

function isEmptySpace(value: Rocks): value is Rocks.None {
  return value === Rocks.None;
}

function checkLoadNorth(matrix: Matrix<Rocks>): number {
  let load = ZERO;
  matrix.forEach((value, rowIndex) => {
    if (value === Rocks.Round) {
      load += matrix.rows - rowIndex;
    }
  });

  return load;
}

function getShiftLocation(
  direction: Direction,
  coordinates: Coordinate,
): Coordinate {
  const rowOffset =
    direction === Direction.North
      ? -ONE
      : direction === Direction.South
        ? ONE
        : ZERO;
  const columnOffset =
    direction === Direction.West
      ? -ONE
      : direction === Direction.East
        ? ONE
        : ZERO;

  return [coordinates[ZERO] + rowOffset, coordinates[ONE] + columnOffset];
}
