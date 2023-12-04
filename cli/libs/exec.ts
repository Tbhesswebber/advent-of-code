import { exec } from "node:child_process";

import type { ChildProcess } from "node:child_process";

export function openBrowser(url: string): ChildProcess {
  if (process.platform === "win32") {
    return exec(`start ${url}`);
  }
  if (process.platform === "darwin") {
    return exec(`open ${url}`);
  }
  return exec(`xdg-open ${url}`);
}
