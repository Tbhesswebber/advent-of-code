import { ONE, ZERO } from "./constants";

export function arraySum(values: number[]): number {
  return values.reduce((sum, value) => sum + value, ZERO);
}

export function arrayMultiply(values: number[]): number {
  return values.reduce((sum, value) => sum * value, ONE);
}

export { default as lowestCommonMultiple } from "compute-lcm";
