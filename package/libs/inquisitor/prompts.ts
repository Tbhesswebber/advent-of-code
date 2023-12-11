import inquirer from "inquirer";

import { ONE, ZERO } from "@lib/constants";

import { getFolderContents } from "../node/fs";

export interface DatePrompt {
  day?: number;
  year?: number;
}
export async function datePrompts<T extends DatePrompt>(
  options: T,
): Promise<Omit<T, keyof DatePrompt> & Required<DatePrompt>> {
  return inquirer.prompt<Omit<T, keyof DatePrompt> & Required<DatePrompt>>(
    [
      {
        name: "year",
        message: "What year would you like to use for this command?",
        async default() {
          const contents = await getFolderContents("");
          return contents
            .filter((name) => /^\d{4}$/.test(name))
            .sort((a, b) => Number(b) - Number(a))
            .at(ZERO);
        },
        type: "list",
        async choices() {
          const contents = await getFolderContents("");
          return contents
            .filter((name) => /^\d{4}$/.test(name))
            .sort((a, b) => Number(b) - Number(a));
        },
      },
      {
        name: "day",
        message: "What day would you like to use for this command?",
        async default(answers: Pick<DatePrompt, "year">) {
          const contents = await getFolderContents(
            answers.year?.toString() ?? "",
          );
          const sorted = contents.sort((a, b) => a.localeCompare(b));
          return Number(sorted.at(-ONE)) + ONE;
        },
        type: "number",
        filter(value: number) {
          const dayLength = 2;
          return value.toString().padStart(dayLength, "0");
        },
      },
    ],
    options as Partial<Omit<T, keyof DatePrompt> & Required<DatePrompt>>,
  );
}
