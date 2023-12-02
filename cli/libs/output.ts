import { resolve } from "node:path";

import { OUTPUT_PATH } from "../constants";

import type { Part } from "../constants";

export function getOutputPath(
  year: number | string,
  day: number | string,
): string {
  const dayLength = 2;
  return resolve(
    OUTPUT_PATH,
    year.toString(),
    day.toString().padStart(dayLength, "0"),
  );
}

export function getInputPath(
  year: number | string,
  day: number | string,
): string {
  return `${getOutputPath(year, day)}/input.txt`;
}

export function getTestInputPath(
  year: number | string,
  day: number | string,
): string {
  return `${getOutputPath(year, day)}/testInput.txt`;
}

export function getSolutionPath(
  year: number | string,
  day: number | string,
  part: Part | "1" | "2",
): string {
  return `${getOutputPath(year, day)}/part${part}.ts`;
}

export function getResultPath(
  year: number | string,
  day: number | string,
): string {
  return `${getOutputPath(year, day)}/result.json`;
}
