import { ZERO } from "@lib/constants";

type DayInputs = string;

const regex = /(?:mul\((\d{1,3}),(\d{1,3})\))|(do\(\))|(don't\(\))/g;

export default function main(inputs: DayInputs): number {
  let isEnabled = true;
  let value = ZERO;

  const matches = inputs.matchAll(regex);

  for (const match of matches) {
    const [command, operand1, operand2] = match;
    if (command === "do()") {
      isEnabled = true;
    }
    if (command === "don't()") {
      isEnabled = false;
    }
    if (command.startsWith("mul") && isEnabled) {
      value += Number.parseInt(operand1, 10) * Number.parseInt(operand2, 10);
    }
  }

  return value;
}

export function transformInput(inputs: string[]): DayInputs {
  return inputs.join("");
}
