import { ONE } from "@lib/constants";
import { arrayMultiply } from "@lib/math";

type DayInputs = [number, number][];

export default function main(inputs: DayInputs): number {
  const results = inputs.map(([time, record]) => {
    return Array.from(
      { length: time },
      (_, index) => index * (time - index),
    ).filter((distance) => distance > record);
  });

  return arrayMultiply(results.map((result) => result.length));
}

export function transformInput(inputs: string[]): DayInputs {
  const [times, records] = inputs.map(
    (list): number[] =>
      list.split(":").at(ONE)?.trim().split(/\s+/).map(Number) || [],
  );

  const parsedInput = times.map((time, index): [number, number] => [
    time,
    records[index],
  ]);

  return parsedInput;
}
