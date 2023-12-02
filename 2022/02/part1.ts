import { ONE, ZERO } from "@lib/constants";
import { arraySum } from "@lib/math";

type DayInputs = { me: number; opponent: number }[];

const myPlay = ["X", "Y", "Z"];
type MyPlay = "X" | "Y" | "Z";

const opponentPlay = ["A", "B", "C"];
type OpponentPlay = "A" | "B" | "C";

const outcomes = {
  loss: 0,
  draw: 3,
  win: 6,
};

const moves = {
  rock: 1,
  paper: 2,
  scissors: 3,
};

export default function main(inputs: DayInputs): unknown {
  const roundResults = inputs.map(({ me, opponent }) => {
    let result: keyof typeof outcomes = "loss";
    if (me > opponent || (me === moves.rock && opponent === moves.scissors)) {
      result = "win";
    }

    if (me === opponent) {
      result = "draw";
    }

    if (opponent === moves.rock && me === moves.scissors) {
      result = "loss";
    }

    return me + outcomes[result];
  });

  return arraySum(roundResults);
}

export function transformInput(
  inputs: `${OpponentPlay} ${MyPlay}`[],
): DayInputs {
  return inputs.map((input) => {
    const opponent = opponentPlay.indexOf(input[ZERO]) + ONE;
    const me = myPlay.indexOf(input.at(-ONE) as MyPlay) + ONE;

    return {
      opponent,
      me,
    };
  });
}
