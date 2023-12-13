import chalk from "chalk";

import { ONE, ZERO } from "@lib/constants";

export type Coordinate = [number, number];

type IterationCallback<T, TResult> = (
  value: T,
  rowIndex: number,
  columnIndex: number,
  row: T[],
  data: Matrix<T>,
) => TResult;

type MatrixData<T> = T[][];

export class Matrix<T> {
  protected data: MatrixData<T>;

  constructor(data: MatrixData<T>) {
    this.data = data;
  }

  get columns(): number {
    return this.data[ZERO]?.length ?? ZERO;
  }

  get rows(): number {
    return this.data.length;
  }

  get size(): number {
    return this.columns * this.rows;
  }

  forEach(callback: IterationCallback<T, void>): void {
    for (let rowIndex = ZERO; rowIndex < this.rows; rowIndex += ONE) {
      const row = this.data[rowIndex];
      for (
        let columnIndex = ZERO;
        columnIndex < this.columns;
        columnIndex += ONE
      ) {
        const value = row[columnIndex];
        callback(value, rowIndex, columnIndex, row, this);
      }
    }
  }

  forEachColumn(
    callback: (column: T[], index: number, all: T[][]) => void,
  ): void {
    const columns = this.getColumns();

    for (let index = ZERO; index < this.data[ZERO].length; index += ONE) {
      const column = this.data.map((row) => row[index]);
      callback(column, index, columns);
    }
  }

  forEachRow(callback: (row: T[], index: number, all: T[][]) => void): void {
    this.data.forEach((row, index, all) => {
      callback(row, index, all);
    });
  }

  get(row: number, column: number): T {
    return this.data[row][column];
  }

  getColumn(column: number): T[] {
    return this.data.map((row) => row[column]);
  }

  getColumns(): T[][] {
    const columns: T[][] = [];
    for (let index = ZERO; index < this.data[ZERO].length; index += ONE) {
      const column = this.data.map((row) => row[index]);
      columns.push(column);
    }
    return columns;
  }

  getRow(row: number): T[] {
    return this.data[row];
  }

  getRows(): T[][] {
    return this.data;
  }

  indexOf(predicate: IterationCallback<T, boolean>): Coordinate {
    for (let rowIndex = ZERO; rowIndex < this.data.length; rowIndex += ONE) {
      const row = this.data[rowIndex];
      for (
        let columnIndex = ZERO;
        columnIndex < this.data.length;
        columnIndex += ONE
      ) {
        const value = row[columnIndex];
        const isTarget = predicate(value, rowIndex, columnIndex, row, this);

        if (isTarget) {
          return [rowIndex, columnIndex];
        }
      }
    }
    return [-ONE, -ONE];
  }

  insertColumn(columnIndex: number, column: T[]): this {
    if (this.size === ZERO) {
      this.data.push(...column.map((value) => [value]));
    }

    if (column.length !== this.rows) {
      throw new Error(
        `Column must have length ${this.data.length} - got column of length ${column.length}`,
      );
    }

    if (columnIndex > this.columns || columnIndex < -this.columns) {
      throw new Error(
        `Column must be inserted between indexes -${this.columns} and ${this.columns}`,
      );
    }

    this.data.forEach((row, rowIndex) => {
      this.data[rowIndex] = [
        ...row.slice(ZERO, columnIndex),
        column[rowIndex],
        ...row.slice(columnIndex),
      ];
    });

    return this;
  }

  insertRow(rowIndex: number, row: T[]): this {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- we want to be certain the index exists
    if (this.data[ZERO] && row.length !== this.data[ZERO].length) {
      throw new Error(`Row must have length ${this.data[ZERO].length}`);
    }

    if (rowIndex > this.data.length || rowIndex < -this.data.length) {
      throw new Error(
        `Row must be inserted between indexes -${this.data.length} and ${this.data.length}`,
      );
    }

    this.data.splice(rowIndex, ZERO, row);

    return this;
  }

  map<TResult>(callback: IterationCallback<T, TResult>): Matrix<TResult> {
    const pseudoMatrix: MatrixData<TResult> = [];

    this.forEach((value, row, column, fullRow, data) => {
      const result = callback(value, row, column, fullRow, data);
      pseudoMatrix[row] ??= [];
      pseudoMatrix[row][column] = result;
    });

    return new Matrix(pseudoMatrix);
  }

  reduceRow<TResult = T[]>(
    callback: (
      aggregate: TResult,
      current: T[],
      index: number,
      matrix: Matrix<T>,
    ) => TResult,
    initial: NonNullable<TResult> | TResult = this.data[ZERO] as TResult,
  ): TResult {
    return this.data.reduce<TResult>(
      (agg, current, index) => callback(agg, current, index, this),
      initial,
    );
  }

  /**
   * @override
   */
  toString(pretty?: boolean): string {
    if (pretty === true)
      return this.data
        .flatMap((row, index) => {
          const values = row
            .map(
              (value) =>
                `${
                  typeof value === "string" ||
                  typeof value === "number" ||
                  typeof value === "boolean"
                    ? value.toString()
                    : JSON.stringify(value)
                }`,
            )
            .join(" ");

          if (index === ZERO) {
            return [row.map((_, column) => column).join(" "), values];
          }

          return [values];
        })
        .join("\n");
    return JSON.stringify(this.data);
  }

  validate(): boolean {
    return (
      this.data.every((row, rowIndex) => {
        if (row.length === this.columns) {
          return true;
        }
        console.error(
          chalk.red.bold(`${rowIndex}: ${row.length} / ${this.rows}`),
        );
        return false;
      }) && this.data.length === this.rows
    );
  }
}
