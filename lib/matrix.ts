import { ONE, ZERO } from "./constants";

export type Matrix<T> = T[][];

export function rotate<T>(matrix: Matrix<T>): Matrix<T> {
  const rotated: Matrix<T> = [];

  for (let index = ZERO; index < matrix.length; index += ONE) {
    const current = matrix[index];

    for (let index2 = ZERO; index2 < current.length; index2 += ONE) {
      rotated[index2] ??= [];
      rotated[index2][index] = current[index2];
    }
  }

  return rotated;
}
