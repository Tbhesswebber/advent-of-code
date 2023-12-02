import { ONE, ZERO } from "@lib/constants";
import { arraySum } from "@lib/math";

type DayInputs = { opponent: OpponentPlay; outcome: TargetOutcome }[];

enum TargetOutcome {
  Loss = "X",
  Tie = "Y",
  Win = "Z",
}

const opponentPlay = ["A", "B", "C"] as const;
type OpponentPlay = (typeof opponentPlay)[number];

/* eslint-disable @typescript-eslint/naming-convention -- need to match the above type */
const moves = {
  A: 1,
  B: 2,
  C: 3,
};
/* eslint-enable @typescript-eslint/naming-convention */

const outcomes: Record<TargetOutcome, number> = {
  [TargetOutcome.Loss]: 0,
  [TargetOutcome.Tie]: 3,
  [TargetOutcome.Win]: 6,
};

export default function main(inputs: DayInputs): unknown {
  const roundResults = inputs.map(({ outcome, opponent }) => {
    if (outcome === TargetOutcome.Tie) {
      return moves[opponent] + outcomes[outcome];
    }

    if (outcome === TargetOutcome.Loss) {
      return (
        outcomes[outcome] + (opponent === "A" ? moves.C : moves[opponent] - ONE)
      );
    }

    return (
      outcomes[outcome] + (opponent === "C" ? moves.A : moves[opponent] + ONE)
    );
  });

  return arraySum(roundResults);
}

export function transformInput(
  inputs: `${OpponentPlay} ${TargetOutcome}`[],
): DayInputs {
  return inputs.map((input) => {
    const opponent = input[ZERO] as OpponentPlay;
    const outcome = input.at(-ONE) as TargetOutcome;

    return {
      opponent,
      outcome,
    };
  });
}
