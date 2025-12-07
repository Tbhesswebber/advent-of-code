import { ONE, ZERO } from "@lib/constants";
import { Matrix } from "@lib/data-structures/matrix";

type DayInputs = ReturnType<typeof transformInput>;

const EMPTY = ".";
const SPLITTER = "^";
const START = "S";
const BEAM = "|";

export default function main(inputs: DayInputs): number {
  let splits = ZERO;

  const outputMatrix = new Matrix<
    typeof BEAM | typeof EMPTY | typeof SPLITTER | typeof START
  >(inputs.getRows());

  inputs.forEach((value, rowIndex, columnIndex) => {
    if (value === START) {
      outputMatrix.set(rowIndex, columnIndex, BEAM);
      return;
    }
    if (rowIndex === ZERO) return;
    const valueAbove = outputMatrix.get(rowIndex - ONE, columnIndex);
    if (value === SPLITTER && valueAbove === BEAM) {
      const topLeft = outputMatrix.get(rowIndex - ONE, columnIndex - ONE);
      const topRight = outputMatrix.get(rowIndex - ONE, columnIndex + ONE);
      if (topLeft && topLeft !== SPLITTER) {
        outputMatrix.set(rowIndex, columnIndex - ONE, BEAM);
      }
      if (topRight && topRight !== SPLITTER) {
        outputMatrix.set(rowIndex, columnIndex + ONE, BEAM);
      }

      splits += ONE;
      return;
    }
    if (valueAbove === BEAM) {
      outputMatrix.set(rowIndex, columnIndex, BEAM);
    }
  });

  console.log(outputMatrix.toString(true));

  return splits;
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
