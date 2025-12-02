import { HUNDRED, ONE, ZERO } from "@lib/constants";

interface DayInput {
  ascending: boolean;
  count: number;
}
type DayInputs = DayInput[];

const start = 50;
export default function main(inputs: DayInputs): number {
  let password = ZERO;
  const lastPosition = inputs.reduce((position, { ascending, count }) => {
    if (ascending) {
      const nextPosition = normalizePosition(position + count);
      const timesCountCrossesZeroAlone = Math.floor(count / HUNDRED);
      const timesCrossingZero =
        position + (count % HUNDRED) > HUNDRED ? ONE : ZERO;
      password += timesCrossingZero + timesCountCrossesZeroAlone;
      console.log({ timesCountCrossesZeroAlone, timesCrossingZero });
      return nextPosition;
    }

    const nextPosition = normalizePosition(position - count);
    const timesCountCrossesZeroAlone = Math.floor(count / HUNDRED);
    const timesCrossingZero = position - (count % HUNDRED) < ZERO ? ONE : ZERO;
    password += timesCrossingZero + timesCountCrossesZeroAlone;
    console.log({ timesCountCrossesZeroAlone, timesCrossingZero });
    return nextPosition;
  }, start);

  return password + (lastPosition === ZERO ? ONE : ZERO);
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
