import chalk from "chalk";

import { ZERO } from "./constants";

export function log<T>(value: T, ...values: unknown[]): T {
  console.log(value, ...values);
  return value;
}

export function error<T>(value: T): T {
  if (value instanceof Error) {
    console.error(chalk.bgRed.black(value.stack));
  } else {
    console.error(chalk.bgRed.black(value));
  }

  return value;
}

export function frame(value: string, padding = 4): string {
  const gapCount = 2;
  const gap = " ".repeat(padding / gapCount);
  const lines = value.split("\n");
  const maxLineLength = lines.reduce(
    (max, current) => Math.max(max, current.length),
    ZERO,
  );

  const message = `
/${"*".repeat(maxLineLength + padding)}\\
*${gap}${" ".repeat(maxLineLength)}${gap}*
${lines
  .map(
    (line) => `*${gap}${line}${" ".repeat(maxLineLength - line.length)}${gap}*`,
  )
  .join("\n")}
*${gap}${" ".repeat(maxLineLength)}${gap}*
\\${"*".repeat(maxLineLength + padding)}/
`;

  console.log(chalk.bold.blue(message));

  return message;
}

export const logger = {
  log,
  error,
  frame,
};
