import { ONE, ZERO } from "@lib/constants";

import type { Subprocess, SyncSubprocess } from "bun";

export function exec(
  cmd: string[] | string,
  config: { sync: true; cwd?: string },
): SyncSubprocess;
export function exec(
  cmd: string[] | string,
  config?: { cwd?: string; sync?: false },
): Subprocess;
export function exec(
  cmd: string[] | string,
  { cwd, sync }: { cwd?: string; sync?: boolean } = {},
): Subprocess | SyncSubprocess {
  if (sync === true) {
    return Bun.spawnSync(Array.isArray(cmd) ? cmd : [cmd], { cwd });
  }
  return Bun.spawn(Array.isArray(cmd) ? cmd : [cmd], { cwd });
}

export function openBrowser(url: string): Subprocess {
  if (process.platform === "win32") {
    return exec([`start`, url]);
  }
  if (process.platform === "darwin") {
    return exec([`open`, url]);
  }
  return exec([`xdg-open`, url]);
}

export function report(
  message: string[] | string,
  { critical }: { critical?: true } = {},
): Subprocess {
  return exec([
    "notify-send",
    critical ? "--urgency critical" : "",
    typeof message === "string" ? `"${message}"` : message[ZERO],
    typeof message === "string" ? "" : `"${message.slice(ONE).join("\n")}"`,
  ]);
}
