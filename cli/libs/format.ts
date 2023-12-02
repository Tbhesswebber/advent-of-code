import chalk from "chalk";

import { ZERO } from "@lib/constants";

export function jsonify(value: unknown): string {
  const indent = 2;
  return JSON.stringify(value, null, indent);
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
