import { jsonify } from "@lib/format";

import type { AoC } from "../api";

export const emptyFileTemplate = "";

export const emptyJsonFileTemplate = "{}";

export const resultsFileTemplate = jsonify({
  one: { answer: null, attempts: [] },
  two: { answer: null, attempts: [] },
} satisfies AoC.ResultsFile);

export const solutionFileTemplate = `type DayInputs = ReturnType<typeof transformInput>;

export default function main(inputs: DayInputs): number {
  throw new Error("Not yet implemented");
}

export function transformInput(inputs: string[]) {
    return inputs;
}`;
