import chalk from "chalk";

import { ONE, ZERO } from "@lib/constants";

// [ROW, COLUMN]
export type Coordinate = [number, number];

type IterationCallback<T, TResult> = (
  value: T,
  rowIndex: number,
  columnIndex: number,
  row: T[],
  data: Matrix<T>,
) => TResult;

type Indexable<T> = Iterable<T> & Record<number, T>;
export type MatrixData<T> = T[][];

export class Matrix<T> {
  protected data: MatrixData<T>;

  private asString: string | undefined = undefined;

  private rawData: Indexable<T>[];

  private shouldCache: boolean;

  constructor(
    data: Indexable<T>[],
    { shouldCache }: { shouldCache?: boolean } = {},
  ) {
    this.shouldCache = shouldCache ?? true;
    this.rawData = data;
    this.data = this.shouldCache
      ? new Proxy(
          this.rawData.map((row) =>
            Matrix.rowProxy([...row], this.resetCachedValues.bind(this)),
          ),
          {
            set: (target, property, nextValue: T[], receiver) => {
              this.resetCachedValues();
              return Reflect.set(
                target,
                property,
                Matrix.rowProxy(nextValue, this.resetCachedValues.bind(this)),
                receiver,
              );
            },
          },
        )
      : this.rawData.map((row) => [...row]);
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

  private static rowProxy<T>(row: T[], onSet: () => void): T[] {
    return new Proxy(row, {
      set: (target, property, nextValue: T, receiver) => {
        onSet();
        return Reflect.set(target, property, nextValue, receiver);
      },
    });
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

  get(row: number, column: number): T | undefined {
    return this.data.at(row)?.at(column);
  }

  getColumn(column: number): T[] | undefined {
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

  getRow(row: number): T[] | undefined {
    return this.data[row];
  }

  getRows(): T[][] {
    return this.data;
  }

  getWindow(origin: Coordinate, width: number, height: number): Matrix<T> {
    const data = this.data
      .slice(origin[ZERO], origin[ZERO] + height)
      .map((row) => row.slice(origin[ONE], origin[ONE] + width));
    return new Matrix(data, { shouldCache: this.shouldCache });
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

  isInRange([row, column]: Coordinate): boolean {
    return (
      row >= ZERO && row < this.rows && column >= ZERO && column < this.columns
    );
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

  set(row: number, column: number, value: T): void {
    this.data[row][column] = value;
  }

  spliceRows(startRow: number, deleteCount: number, insertion: T[][]): this {
    this.data.splice(startRow, deleteCount, ...insertion);

    return this;
  }

  /**
   * @override
   */
  toString(pretty?: boolean): string {
    if (pretty === true) {
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
    }

    if (!this.shouldCache) {
      return JSON.stringify(this.data);
    }
    if (this.asString === undefined) {
      this.asString = JSON.stringify(this.data);
    }
    return this.asString;
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

  private resetCachedValues(): void {
    this.asString = undefined;
  }
}
