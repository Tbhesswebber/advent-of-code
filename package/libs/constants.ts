import { resolve } from "node:path";

export const OUTPUT_PATH = resolve(import.meta.dir, "../../");

export const enum Part {
  One = "1",
  Two = "2",
}

export const DECEMBER = 11;

export const RUNTIME_BEFORE_IDLE = 5000;
