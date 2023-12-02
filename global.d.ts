export interface SolutionModule<T> {
  default(value: T): unknown;
  transformInput?(input: string[]): T;
}
