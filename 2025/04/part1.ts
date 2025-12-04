import { ONE, ZERO } from "@lib/constants";
import { Matrix } from "@lib/data-structures/matrix";

type DayInputs = ReturnType<typeof transformInput>;

const EMPTY = ".";
const PAPER_ROLL = "@";
const MOVED = "x";

export default function main(inputs: DayInputs): number {
  let movableRows = ZERO;
  const outputMatrix = new Matrix(inputs.getRows());
  inputs.forEach((cell, rowIndex, columnIndex, row) => {
    if (cell === EMPTY) return;
    const windowBounds = [
      Math.max(ZERO, columnIndex - ONE),
      Math.min(columnIndex + ONE + ONE, inputs.columns),
    ];
    const window = [
      getRowOrEmpty(inputs, rowIndex - ONE).slice(...windowBounds),
      row.slice(...windowBounds),
      getRowOrEmpty(inputs, rowIndex + ONE).slice(...windowBounds),
    ];

    // if (columnIndex === ZERO) {
    //   console.log({ rowIndex, columnIndex });
    //   console.log(new Matrix(window).toString(true));
    //   console.log(windowBounds);
    // }

    if (isMoveable(window)) {
      outputMatrix.set(rowIndex, columnIndex, MOVED);
      movableRows += ONE;
    }
  });

  console.log(outputMatrix.toString(true));

  return movableRows;
}

export function transformInput(inputs: string[]): Matrix<string> {
  return new Matrix(inputs.map((input) => [...input]));
}

function isMoveable(area: string[][]): boolean {
  const FOUR = 5;
  return (
    area
      .flat()
      .reduce(
        (count, current): number =>
          count + (current === PAPER_ROLL ? ONE : ZERO),
        ZERO,
      ) < FOUR
  );
}

function getRowOrEmpty(matrix: Matrix<string>, row: number): string[] {
  const emptyRow = Array.from({ length: matrix.columns }, () => EMPTY);
  try {
    return matrix.getRow(row) ?? emptyRow;
  } catch {
    return emptyRow;
  }
}
