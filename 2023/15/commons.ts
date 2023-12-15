import { ZERO } from "@lib/constants";

export function hash(value: string): number {
  let current = ZERO;
  const multiplier = 17;
  const divisor = 256;

  [...value].forEach((char) => {
    current += char.codePointAt(ZERO) ?? ZERO;
    current *= multiplier;
    current %= divisor;
  });

  return current;
}
