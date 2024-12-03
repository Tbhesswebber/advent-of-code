import { ONE, ZERO } from "@lib/constants";

type DayInputs = number[][];

export default function main(inputs: DayInputs): number {
  return inputs.filter((report) => {
    const isSafe = isSafeTreeAsc(report) || isSafeTreeAsc(report.reverse());

    return isSafe;
  }).length;
}

export function transformInput(inputs: string[]): DayInputs {
  return inputs.map((line) =>
    line.split(/\s+/).map((n) => Number.parseInt(n, 10)),
  );
}

function isSafeTreeAsc(levels: number[]): boolean {
  const indices = Array.from(levels, (_, index) => index);
  const indexDroppers = indices.map((index) => (l: number[]) => {
    const copy = [...l];
    copy.splice(index, ONE);
    return isSafeAsc(copy);
  });

  return [isSafeAsc, ...indexDroppers].some((callback) => callback(levels));
}

function isSafeAsc(levels: number[]): boolean {
  for (let index = ZERO; index < levels.length - ONE; index += ONE) {
    const current = levels[index];
    const next = levels[index + ONE];

    if (!isSafeDistance(next, current)) {
      return false;
    }
  }

  return true;
}

function isSafeDistance(a: number, b: number) {
  const maxDistance = 3;
  const minDistance = 1;
  return a - b <= maxDistance && a - b >= minDistance;
}
