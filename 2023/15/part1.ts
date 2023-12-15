import { arraySum } from "@lib/math";

import { hash } from "./commons";

type DayInputs = string[];

export default function main(inputs: DayInputs): number {
  const result = inputs.map((step) => hash(step));

  return arraySum(result);
}

export function transformInput(inputs: string[]): DayInputs {
  return inputs.join(",").split(",").filter(Boolean);
}
