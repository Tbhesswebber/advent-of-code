import parser from "./part1";

type DayArgs = string[];

const numStringToNum: Record<string, string> = {
  zero: "0",
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
};

export default function main(args: DayArgs) {
  const numberString =
    /(zero)|(one)|(two)|(three)|(four)|(five)|(six)|(seven)|(eight)|(nine)/g;
  const transformed = args.map((arg) =>
      arg
        .replace(numberString, (match) => {
          return numStringToNum[match] + match.slice(1);
        })
        .replace(numberString, (match) => {
          return numStringToNum[match] + match.slice(1);
        })
  );

  return parser(transformed);
}
