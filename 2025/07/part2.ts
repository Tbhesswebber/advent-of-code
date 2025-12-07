import { ONE, ZERO } from "@lib/constants";
import { Matrix } from "@lib/data-structures/matrix";
import { arraySum } from "@lib/math";

type DayInputs = ReturnType<typeof transformInput>;

const EMPTY = ".";
const SPLITTER = "^";
const START = "S";

export default function main(inputs: DayInputs): number {
  const resultMatrix = new Matrix<number | typeof EMPTY>(
    inputs.getRows().map((row) => row.map(() => EMPTY)),
  );

  inputs.forEach((value, rowIndex, columnIndex) => {
    if (value === START) {
      resultMatrix.set(rowIndex, columnIndex, ONE);
      return;
    }
    const valueAbove = resultMatrix.get(rowIndex - ONE, columnIndex);
    if (rowIndex === ZERO || valueAbove === undefined || valueAbove === EMPTY)
      return;
    if (value === SPLITTER) {
      const left = resultMatrix.get(rowIndex, columnIndex - ONE);
      const right = resultMatrix.get(rowIndex, columnIndex + ONE);
      if (typeof left === "number") {
        resultMatrix.set(rowIndex, columnIndex - ONE, left + valueAbove);
      } else if (left !== undefined) {
        resultMatrix.set(rowIndex, columnIndex - ONE, valueAbove);
      }
      if (typeof right === "number") {
        resultMatrix.set(rowIndex, columnIndex + ONE, right + valueAbove);
      } else if (right !== undefined) {
        resultMatrix.set(rowIndex, columnIndex + ONE, valueAbove);
      }

      return;
    }

    const currentTimelinesThroughValue = resultMatrix.get(
      rowIndex,
      columnIndex,
    );
    if (typeof currentTimelinesThroughValue === "number") {
      resultMatrix.set(
        rowIndex,
        columnIndex,
        currentTimelinesThroughValue + valueAbove,
      );
    } else {
      resultMatrix.set(rowIndex, columnIndex, valueAbove);
    }
  });

  return arraySum(
    resultMatrix
      .getRows()
      .at(-ONE)
      ?.filter((value) => typeof value === "number") ?? [],
  );
}

export function transformInput(
  inputs: string[],
): Matrix<typeof EMPTY | typeof SPLITTER | typeof START> {
  return new Matrix(
    inputs.map(
      (line) => [...line] as (typeof EMPTY | typeof SPLITTER | typeof START)[],
    ),
  );
}
