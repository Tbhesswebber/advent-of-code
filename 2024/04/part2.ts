import { ONE, ZERO } from "@lib/constants";
import { Matrix } from "@lib/data-structures/matrix";
import { logger } from "@lib/logger";

type DayInputs = Matrix<string>;

const WORD_TO_FIND = "MAS";

export default function main(inputs: DayInputs): number {
  let count = ZERO;

  inputs.forEach((value, rowIndex, columnIndex) => {
    if (
      value.toLowerCase() !== WORD_TO_FIND.toLowerCase().at(ZERO) &&
      value.toLowerCase() !== WORD_TO_FIND.toLowerCase().at(-ONE)
    ) {
      return;
    }

    const window = inputs.getWindow(
      [rowIndex, columnIndex],
      WORD_TO_FIND.length,
      WORD_TO_FIND.length,
    );

    if (
      window.rows !== WORD_TO_FIND.length ||
      window.columns !== WORD_TO_FIND.length
    ) {
      return;
    }

    logger.log(`[${rowIndex}][${columnIndex}] - ${value} - ${count}`);

    logger.log(window.toString(true));

    count += Number(isXmasWindow(window));
  });

  return count;
}

export function transformInput(inputs: string[]): DayInputs {
  return new Matrix(inputs.map((line) => [...line]));
}

function isXmasWindow(window: Matrix<string>): boolean {
  if (
    window.rows > WORD_TO_FIND.length ||
    window.columns > WORD_TO_FIND.length
  ) {
    throw new TypeError("Expected to be passed four or fewer characters");
  }

  if (
    window.rows < WORD_TO_FIND.length ||
    window.columns < WORD_TO_FIND.length
  ) {
    return false;
  }

  const TWO = 2;
  const middleIndex = Math.round((WORD_TO_FIND.length - ONE) / TWO);

  const tl = window.get(ZERO, ZERO)?.toLowerCase();
  const tr = window.get(ZERO, -ONE)?.toLowerCase();
  const m = window.get(middleIndex, middleIndex)?.toLowerCase();
  const bl = window.get(-ONE, ZERO)?.toLowerCase();
  const br = window.get(-ONE, -ONE)?.toLowerCase();

  const tlToBr = [tl, m, br];
  const trToBl = [tr, m, bl];

  console.log({ tlToBr, trToBl, search: WORD_TO_FIND.toLowerCase() });

  return (
    [tlToBr.join(""), tlToBr.reverse().join("")].includes(
      WORD_TO_FIND.toLowerCase(),
    ) &&
    [trToBl.join(""), trToBl.reverse().join("")].includes(
      WORD_TO_FIND.toLowerCase(),
    )
  );
}
