import { ONE } from "@lib/constants";

type DayInputs = number[][];

export default function main(inputs: DayInputs): number {
  return inputs.filter(
    (report) => isSafeAscending(report) || isSafeDescending(report),
  ).length;
}

export function transformInput(inputs: string[]): DayInputs {
  return inputs.map((line) =>
    line.split(/\s+/).map((n) => Number.parseInt(n, 10)),
  );
}

const firstIndex = 0;
const maxDistance = 3;
const minDistance = 1;

function isSafeAscending(levels: number[]): boolean {
  return levels.every((current, index) => {
    const previousIndex = index - ONE;
    return (
      index === firstIndex ||
      (levels[previousIndex] - current <= maxDistance &&
        levels[previousIndex] - current >= minDistance)
    );
  });
}

function isSafeDescending(levels: number[]): boolean {
  return levels.every((current, index) => {
    const previousIndex = index - ONE;
    return (
      index === firstIndex ||
      (current - levels[previousIndex] <= maxDistance &&
        current - levels[previousIndex] >= minDistance)
    );
  });
}
