import { ZERO } from "@lib/constants";

export class ChristmasError extends Error {
  public static readonly endDay = 25;

  public static readonly firstYear = 2015;

  public static readonly month = 11;

  public static readonly startDay = 1;

  name = "ChristmasError";

  constructor(date: Date | string);

  constructor(day: number, year: number);

  constructor(dayMessageOrDate: Date | number | string, yearArgument?: number) {
    let message: string | undefined;
    let day = ZERO;
    let year = ZERO;
    // eslint-disable-next-line prefer-destructuring -- the resulting type is Readonly<12>, so we can't assign to it
    let month = ChristmasError.month;

    if (dayMessageOrDate instanceof Date) {
      day = dayMessageOrDate.getDate();
      month = dayMessageOrDate.getMonth();
      year = dayMessageOrDate.getFullYear();
    } else if (typeof dayMessageOrDate === "string") {
      message = dayMessageOrDate;
    } else if (yearArgument === undefined) {
      message =
        "It seems that an elf messed with this error message - what to do??";
    } else {
      day = dayMessageOrDate;
      year = yearArgument;
    }

    if (message === undefined) {
      if (day < ChristmasError.startDay || day > ChristmasError.endDay) {
        message =
          "Advent of Code is only active from the first to Christmas Day, silly!";
      } else if (year < ChristmasError.firstYear) {
        message = `Advent of Code wasn't created until ${ChristmasError.firstYear} - even Santa can't go back in time!`;
      } else if (month !== ChristmasError.month) {
        message = `Advent of Code only happens during December, but I like your Christmas spirit!`;
      }
    }

    super(message);
  }

  static validateDate(date: Date): boolean;

  static validateDate(day: number, year: number): boolean;

  static validateDate(
    dayOrDate: Date | number,
    yearArgument?: number,
  ): boolean {
    let day = ZERO;
    let year = ZERO;
    // eslint-disable-next-line prefer-destructuring -- the resulting type is Readonly<12>, so we can't assign to it
    let month = ChristmasError.month;

    if (dayOrDate instanceof Date) {
      day = dayOrDate.getDate();
      month = dayOrDate.getMonth();
      year = dayOrDate.getFullYear();
    } else if (
      typeof dayOrDate === "number" &&
      typeof yearArgument === "number"
    ) {
      day = dayOrDate;
      year = yearArgument;
    } else {
      throw new TypeError(
        `ChristmasError.validateDate arguments must be of type \`[Date] | [number, number]\`.  Got: [${typeof dayOrDate}, ${typeof yearArgument}] `,
      );
    }

    return (
      day <= ChristmasError.endDay &&
      day >= ChristmasError.startDay &&
      month === ChristmasError.month &&
      year >= ChristmasError.firstYear
    );
  }
}
