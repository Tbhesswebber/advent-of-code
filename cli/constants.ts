import { resolve } from "node:path";

// eslint-disable-next-line unicorn/prefer-module -- this is easier for now
export const OUTPUT_PATH = resolve(__dirname, "../");

export const enum Part {
  One = 1,
  Two = 2,
}
