import { ONE, ZERO } from "@lib/constants";
import { Matrix } from "@lib/data-structures/matrix";

type DayInputs = ReturnType<typeof transformInput>;

interface Problem {
  numbers: number[];
  operator: typeof ADD | typeof MULTIPLY;
}

const ADD = "+";
const MULTIPLY = "*";

export default function main(inputs: DayInputs): number {
  let total = ZERO;

  inputs.forEach(({ operator, numbers }) => {
    const currentResult = numbers.reduce((subtotal, current) => {
      if (operator === ADD) {
        return subtotal + current;
      }

      return subtotal * current;
    });
    total += currentResult;
  });

  return total;
}

export function transformInput(inputs: string[]): Problem[] {
  const characters = new Matrix(inputs.map((line) => [...line]));
  const problems: Problem[] = [];

  const columns = characters.getColumns();
  let currentProblem: Partial<Problem> = {};
  for (
    let currentIndex = ZERO;
    currentIndex < columns.length;
    currentIndex += ONE
  ) {
    const currentColumn = columns[currentIndex];
    if (currentColumn.join("").trim() === "") {
      problems.push(currentProblem as Problem);
      currentProblem = {};
    } else {
      const operatorOrEmpty = currentColumn.pop();
      if (operatorOrEmpty !== undefined && operatorOrEmpty.trim() !== "") {
        currentProblem.operator = operatorOrEmpty === ADD ? ADD : MULTIPLY;
      }
      currentProblem.numbers ??= [];
      currentProblem.numbers.push(
        Number.parseInt(currentColumn.join("").trim(), 10),
      );
    }
  }
  problems.push(currentProblem as Problem);

  return problems;
}
