import { ONE } from "./constants";

export function isOdd(value: number): boolean {
  const TWO = 2;
  return value % TWO === ONE;
}

export function isEven(value: number): boolean {
  return !isOdd(value);
}
