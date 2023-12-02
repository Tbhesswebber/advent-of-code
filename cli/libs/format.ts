import chalk from "chalk";

export function jsonify(value: unknown): string {
  const indent = 2;
  return JSON.stringify(value, null, indent);
}

export function frame(value: string, padding = 4): string {
  const gapCount = 2;
  const gap = " ".repeat(padding / gapCount);

  const message = `
/${"*".repeat(value.length + padding)}\\
*${gap}${" ".repeat(value.length)}${gap}*
*${gap}${value}${gap}*
*${gap}${" ".repeat(value.length)}${gap}*
\\${"*".repeat(value.length + padding)}/
`;

  console.log(chalk.bold.blue(message));

  return message;
}
