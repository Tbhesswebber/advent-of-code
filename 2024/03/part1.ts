import { ZERO } from "@lib/constants";

type DayInputs = string;

const regex = /mul\((\d{1,3}),(\d{1,3})\)/g;

export default function main(inputs: DayInputs): number {
  console.log(inputs);
  const matches = inputs.matchAll(regex);
  let value = ZERO;
  for (const match of matches) {
    console.log(match);
    const [, operand1, operand2] = match;
    value += Number.parseInt(operand1, 10) * Number.parseInt(operand2, 10);
  }

  return value;
}

export function transformInput(inputs: string[]): DayInputs {
  return inputs.join("");
}
