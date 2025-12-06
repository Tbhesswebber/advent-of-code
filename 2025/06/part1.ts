import { ONE, ZERO } from "@lib/constants";
import { Matrix } from "@lib/data-structures/matrix";

type DayInputs = ReturnType<typeof transformInput>;

const ADD = "+";
const MULTIPLY = "*";

export default function main(inputs: DayInputs): number {
  let total = ZERO;

  inputs.getColumns().forEach((problem) => {
    const operator = problem.at(-ONE);
    if (operator === "") {
      return;
    }

    total += problem
      .slice(ZERO, -ONE)
      .map((current) => Number.parseInt(current.trim(), 10))
      .reduce((subtotal, current) => {
        if (operator === ADD) {
          return subtotal + current;
        }
        if (operator === MULTIPLY) {
          return subtotal * current;
        }
        return subtotal;
      });
  });

  return total;
}

export function transformInput(inputs: string[]): Matrix<string> {
  return new Matrix(
    inputs.map((line) => line.trim().replaceAll(/\s+/g, " ").split(" ")),
  );
}
