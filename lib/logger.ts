import chalk from "chalk";
import inquirer from "inquirer";

import { ONE, ZERO } from "./constants";
import { formatToHumanNumber } from "./format";

const ui = new inquirer.ui.BottomBar();

export function log<T>(value: T): T {
  const spacing = 2;
  ui.log.write(
    typeof value === "object" ? JSON.stringify(value, null, spacing) : value,
  );
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

  ui.log.write(chalk.bold.blue(message));

  return message;
}

function* spinnerGenerator(): Generator<string, string, boolean> {
  const symbols = ["/", "-", "\\", "|"];
  let index = ZERO;
  let shouldRun = true;
  while (shouldRun) {
    shouldRun = yield symbols[(index += ONE) % symbols.length];
  }

  return "█";
}

function makeProgressLogger(total: number): (value?: number) => void {
  const { columns } = process.stdout;
  const spinner = spinnerGenerator();
  function getProgressString(value: number): string {
    const progressRatio = value > ZERO ? value / total : ZERO;
    const progressString = `${
      spinner.next(progressRatio !== ONE).value
    } - ${value}/${total}`;
    const emptyBracketCount = 2;
    const bracketCount =
      progressRatio < ONE / columns
        ? emptyBracketCount
        : progressRatio === ONE
          ? ZERO
          : ONE;
    const extraCharacterCount = progressString.length + bracketCount;
    const availableColumns = columns - extraCharacterCount;
    const filledColumnCount = Math.floor(progressRatio * availableColumns);
    const emptyColumnCount = availableColumns - filledColumnCount;

    return `${bracketCount === emptyBracketCount ? "[" : ""}${"█".repeat(
      filledColumnCount,
    )}${" ".repeat(emptyColumnCount)}${
      bracketCount === ONE ? "]" : ""
    }${progressString}`;
  }

  let defaultValue = ZERO;

  return (value?: number) => {
    defaultValue = value ?? defaultValue;
    ui.updateBottomBar(
      // eslint-disable-next-line no-plusplus -- inconsequential
      chalk.white.bold(getProgressString(defaultValue++)),
    );
  };
}

interface Count {
  (id?: string): void;
  <T>(value: T, id?: string): T;
}

function countFactory(): Count {
  const idCountMap = new Map<string, number>();
  function updateBottomBar() {
    ui.updateBottomBar(
      [...idCountMap.entries()]
        .map(([key, count]) => `${key}: ${formatToHumanNumber(count)}`)
        .join(" --- "),
    );
  }
  let lastUpdated = Date.now();
  // let timeout: NodeJS.Timeout;
  const interval = 1000;
  return <T = undefined>(valueOrId: T, id?: string): T => {
    if (Date.now() - lastUpdated > interval) {
      // clearTimeout(timeout);
      updateBottomBar();
      lastUpdated = Date.now();
      // timeout = setTimeout(updateBottomBar, interval);
    }
    if (valueOrId === undefined && id === undefined) {
      idCountMap.set("default", (idCountMap.get("default") ?? ZERO) + ONE);
      return valueOrId;
    }
    if (typeof valueOrId !== "string" && id === undefined) {
      idCountMap.set("default", (idCountMap.get("default") ?? ZERO) + ONE);
      return valueOrId;
    }
    if (typeof id === "string") {
      idCountMap.set(id, (idCountMap.get(id) ?? ZERO) + ONE);
      return valueOrId;
    }
    if (typeof valueOrId === "string") {
      idCountMap.set(valueOrId, (idCountMap.get(valueOrId) ?? ZERO) + ONE);
      return valueOrId;
    }
    throw new Error(
      `A count condition is broken. valueOrId = ${JSON.stringify(
        valueOrId,
      )}, id = ${id}`,
    );
  };
}

export const logger = {
  count: countFactory(),
  log,
  error,
  frame,
  makeProgressLogger,
};
