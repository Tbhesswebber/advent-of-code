import { ZERO } from "@lib/constants";

export class InputError extends Error {
  name = "InputError";

  constructor(inputsOrMessage: string[] | string) {
    let message = "An unknown error occurred processing inputs";

    if (typeof inputsOrMessage === "string") {
      message = inputsOrMessage;
    } else if (inputsOrMessage.length === ZERO) {
      message = "Command received no inputs";
    } else if (inputsOrMessage.every((row) => row.trim().length === ZERO)) {
      message = "Command received a list of empty values";
    }

    super(message);
  }
}
