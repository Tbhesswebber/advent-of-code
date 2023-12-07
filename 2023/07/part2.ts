import { countBy } from "lodash/fp";

import { ONE, ZERO } from "@lib/constants";
import { arraySum } from "@lib/math";

interface CamelCardRound {
  bid: number;
  hand: string;
  score: string;
  type: HandType;
}

enum HandType {
  HighCard,
  Pair,
  TwoPair,
  ThreeKind,
  FullHouse,
  FourKind,
  FiveKind,
}

// eslint-disable-next-line @typescript-eslint/no-magic-numbers -- it's the input
const cards = [
  "A",
  "K",
  "Q",
  "T",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
  "J",
].reverse();

type DayInputs = CamelCardRound[];

export default function main(inputs: DayInputs): number {
  const scores = inputs
    .sort((a, b) => compareScores(a.score, b.score))
    .sort((a, b) => compareHandType(a.type, b.type))
    .reverse()
    .map((hand, index) => ({
      ...hand,
      rank: index + ONE,
      totalScore: hand.bid * (index + ONE),
    }))
    .map(({ bid }, index) => bid * (index + ONE));

  return arraySum(scores);
}

export function transformInput(inputs: string[]): DayInputs {
  return inputs.filter(Boolean).map((input) => {
    const [hand, bid] = input.split(" ");
    return {
      hand,
      bid: Number(bid),
      type: getHandType(hand),
      score: getScore(hand),
    };
  });
}

function compareScores(a: string, b: string, index = 0): number {
  if (Number(a.split("-")[index]) < Number(b.split("-")[index])) {
    return ONE;
  }
  if (Number(a.split("-")[index]) > Number(b.split("-")[index])) {
    return -ONE;
  }
  return compareScores(a, b, index + ONE);
}

function compareHandType(a: HandType, b: HandType): number {
  return b - a;
}

function getScore(handString: string): string {
  return [...handString].map((char) => cards.indexOf(char)).join("-");
}

function getHandType(handString: string): HandType {
  /* eslint-disable @typescript-eslint/no-magic-numbers -- self-explanatory in this context */
  const hand = [...handString];
  const countsWithJokers = countBy((value) => value, hand);
  const { J: jokers = ZERO, ...counts } = countsWithJokers;

  if (Math.max(...Object.values(counts)) + jokers === 5 || jokers === 5) {
    return HandType.FiveKind;
  }
  if (Math.max(...Object.values(counts)) + jokers === 4) {
    return HandType.FourKind;
  }
  if (
    Math.max(...Object.values(counts)) + jokers === 3 &&
    Math.min(...Object.values(counts)) === 2
  ) {
    return HandType.FullHouse;
  }
  if (Math.max(...Object.values(counts)) + jokers === 3) {
    return HandType.ThreeKind;
  }
  const pairs = Object.values(counts).filter((count) => count === 2);
  if (pairs.length === 2) {
    return HandType.TwoPair;
  }
  return pairs.length > 0 || jokers === 1 ? HandType.Pair : HandType.HighCard;
  /* eslint-enable @typescript-eslint/no-magic-numbers */
}
