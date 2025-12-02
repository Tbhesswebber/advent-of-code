import { ONE, ZERO } from "@lib/constants";

interface DayInput {
  ascending: boolean;
  count: number;
}
type DayInputs = DayInput[];

const start = 50;
const max = 99;
export default function main(inputs: DayInputs): number {
  let password = ZERO;
  inputs.reduce((position, { ascending, count }) => {
    const nextValue = ascending ? position + count : position - count;
    if (nextValue % (max + ONE) === ZERO) password += ONE;
    return nextValue;
  }, start);
  return password;
}

export function transformInput(inputs: string[]): DayInputs {
  return inputs.map((line) => {
    const direction = line[ZERO];
    const count = line.slice(ONE);
    return { ascending: direction === "R", count: Number.parseInt(count, 10) };
  });
}
