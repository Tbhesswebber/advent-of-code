export interface SolutionModule<T> {
  default(value: T): number;
  transformInput?(input: string[]): T;
}
