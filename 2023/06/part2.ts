import { ONE } from "@lib/constants";
import { arrayMultiply } from "@lib/math";

type DayInputs = [number, number][];

export default function main(inputs: DayInputs): number {
  const results = inputs.map(([time, record]) => {
    return Array.from({ length: time }, (_, index) => {
      return index * (time - index);
    }).filter((distance) => distance >= record);
  });

  return arrayMultiply(results.map((result) => result.length));
}

export function transformInput(inputs: string[]): DayInputs {
  const [time, record] = inputs
    .map(
      (list): string =>
        list.split(":").at(ONE)?.trim().replaceAll(" ", "") ?? "",
    )
    .map(Number);

  return [[time, record]];
}
