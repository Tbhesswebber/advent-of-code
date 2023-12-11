export interface SolutionModule<T> {
  default(value: T): number;
  transformInput?(input: string[]): T;
}

export type Specifically<T, TProperties extends keyof T> = {
  [K in Exclude<keyof T, TProperties>]?: T[K];
} & {
  [K in TProperties]: Exclude<T[K], undefined>;
};

export type Optionally<T, TProperties extends keyof T> = {
  [K in Exclude<keyof T, TProperties>]: Required<T>[K];
} & {
  [K in TProperties]?: Exclude<T[K], undefined>;
};
