import { resolve } from "node:path";
import { OUTPUT_PATH } from "../constants";

export function getOutputPath(year: number|string, day: number | string) {
    return resolve(OUTPUT_PATH, year.toString(), day.toString().padStart(2, "0"))
}

export function getInputPath(year: number | string, day: number | string) {
  return `${getOutputPath(year, day)}/input.txt`;
}

export function getSolutionPath(
  year: number | string,
  day: number | string,
  part: 1 | 2 | "1" | "2"
) {
  return `${getOutputPath(year, day)}/part${part}.ts`;
}

export function getResultPath(
  year: number | string,
  day: number | string,
) {
  return `${getOutputPath(year, day)}/result.json`;
}
