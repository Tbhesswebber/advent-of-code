import { HUNDRED, ONE, ZERO } from "@lib/constants";

interface DayInput {
  ascending: boolean;
  count: number;
}
type DayInputs = DayInput[];

const start = 50;
export default function main(inputs: DayInputs): number {
  let password = ZERO;
  inputs.reduce((position, { ascending, count }) => {
    let nextPosition = position;

    for (let index = count; index > ZERO; index -= ONE) {
      nextPosition = ascending ? nextPosition + ONE : nextPosition - ONE;
      nextPosition = normalizePosition(nextPosition);
      if (nextPosition === ZERO) password += ONE;
    }
    return nextPosition;
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

function normalizePosition(value: number) {
  if (value >= HUNDRED) return value % HUNDRED;
  if (value < ZERO) return HUNDRED - Math.abs(value % HUNDRED);
  return value;
}
