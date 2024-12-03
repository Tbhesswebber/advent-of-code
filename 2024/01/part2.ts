import { arraySum } from "@lib/math";

export { transformInput } from "./part1";

type DayInputs = [number[], number[]];

export default function main([left, right]: DayInputs): number {
  const rightByNumber = Object.groupBy(right, (v: number): number => v);
  const defaultMultiplier = 0;
  return arraySum(
    left.map(
      (value) =>
        value *
        (rightByNumber[value]
          ? rightByNumber[value].length
          : defaultMultiplier),
    ),
  );
}
