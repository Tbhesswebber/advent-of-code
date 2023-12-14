import { ONE, ZERO } from "@lib/constants";
import { Matrix } from "@lib/data-structures/matrix";

import type { Coordinate } from "@lib/data-structures/matrix";

type DayInputs = Matrix<Rocks>;

enum Rocks {
  Round = "O",
  Cube = "#",
  None = ".",
}

export default function main(inputs: DayInputs): number {
  let shifts: number;

  do {
    shifts = ZERO;
    // eslint-disable-next-line no-loop-func -- need access to the shifts variable
    inputs.forEach((value, rowIndex, columnIndex, _, data): void => {
      if (rowIndex === ZERO || !canRoll(value)) return;
      const northLocation: Coordinate = [rowIndex - ONE, columnIndex];
      const northSpace = data.get(...northLocation);

      if (isEmptySpace(northSpace)) {
        data.set(...northLocation, value);
        data.set(rowIndex, columnIndex, Rocks.None);
        shifts += ONE;
      }
    });
  } while (shifts !== ZERO);

  return checkLoad(inputs);
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

function checkLoad(matrix: Matrix<Rocks>): number {
  let load = ZERO;
  matrix.forEach((value, rowIndex) => {
    if (value === Rocks.Round) {
      load += matrix.rows - rowIndex;
    }
  });

  return load;
}
