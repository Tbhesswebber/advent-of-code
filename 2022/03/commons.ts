import { ZERO } from "@lib/constants";

export function stringIntersection(string1: string, string2: string): string {
  const string1Set = new Set(string1);
  const string2Set = new Set(string2);
  return [...string1Set].filter((char) => string2Set.has(char)).join("");
}

export function prioritizeItems(char: string, index: number): number {
  const codePoint = char.codePointAt(ZERO);
  // uppercase codepoints start at 65
  const uppercaseOffset = 38;
  // lowercase codepoints start at 97
  const lowercaseOffset = 96;

  if (codePoint === undefined) {
    const error = new Error(`The codepoint at index ${index} is undefined.`);
    error.name = "IndexError";
    throw error;
  }

  return codePoint <= lowercaseOffset
    ? codePoint - uppercaseOffset
    : codePoint - lowercaseOffset;
}
