import { exec as execCallback } from "node:child_process";
import { promisify } from "node:util";

import type { PromiseWithChild } from "node:child_process";

export const exec = promisify(execCallback);

// eslint-disable-next-line @typescript-eslint/promise-function-async -- we're directly returning the promise, which is a node-wrapped thing
export function openBrowser(
  url: string,
): PromiseWithChild<{ stderr: string; stdout: string }> {
  if (process.platform === "win32") {
    return exec(`start ${url}`);
  }
  if (process.platform === "darwin") {
    return exec(`open ${url}`);
  }
  return exec(`xdg-open ${url}`);
}

// eslint-disable-next-line @typescript-eslint/promise-function-async -- we're directly returning the promise, which is a node-wrapped thing
export function report(
  message: string[] | string,
): PromiseWithChild<{ stderr: string; stdout: string }> {
  return exec(
    `notify-send "${
      typeof message === "string" ? message : message.join('" "')
    }"`,
  );
}
