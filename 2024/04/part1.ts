import { ONE, ZERO } from "@lib/constants";
import { Matrix } from "@lib/data-structures/matrix";
import { logger } from "@lib/logger";

type DayInputs = Matrix<string>;

const WORD_TO_FIND = "XMAS";

export default function main(inputs: DayInputs): number {
  let count = ZERO;

  inputs.forEach((value, rowIndex, columnIndex, row, data) => {
    if (value.toLowerCase() !== "x") return;

    logger.log(`[${rowIndex}][${columnIndex}] - ${value} - ${count}`);

    // look at row right
    if (columnIndex <= data.columns - WORD_TO_FIND.length) {
      count += Number(
        isXmasString(row.slice(columnIndex, columnIndex + WORD_TO_FIND.length)),
      );
      logger.log(`Checked row right - ${count}`);
    }

    // look at row left
    if (columnIndex >= WORD_TO_FIND.length - ONE) {
      count += Number(
        isXmasString(
          row
            .slice(columnIndex - WORD_TO_FIND.length + ONE, columnIndex + ONE)
            .reverse(),
        ),
      );
      logger.log(`Checked row left - ${count}`);
    }

    // look at column down
    if (rowIndex <= data.rows - WORD_TO_FIND.length) {
      const chars: string[] = Array.from(WORD_TO_FIND, (_, index) =>
        data.get(rowIndex + index, columnIndex),
      ).filter((v): v is string => v !== undefined);

      count += Number(isXmasString(chars));
      logger.log(`Checked column down - ${count}`);
    }

    // look at column up
    if (rowIndex >= WORD_TO_FIND.length - ONE) {
      const chars: string[] = Array.from(WORD_TO_FIND, (_, index) =>
        data.get(rowIndex - index, columnIndex),
      ).filter((v): v is string => v !== undefined);

      count += Number(isXmasString(chars));
      logger.log(`Checked column up - ${count}`);
    }

    // look diagonally down and to the right
    if (
      rowIndex <= data.rows - WORD_TO_FIND.length &&
      columnIndex <= data.columns - WORD_TO_FIND.length
    ) {
      const chars: string[] = Array.from(WORD_TO_FIND, (_, index) =>
        data.get(rowIndex + index, columnIndex + index),
      ).filter((v): v is string => v !== undefined);

      count += Number(isXmasString(chars));
      logger.log(`Checked diagonally dr - ${count}`);
    }

    // look diagonally down and to the left
    if (
      rowIndex <= data.rows - WORD_TO_FIND.length &&
      columnIndex >= WORD_TO_FIND.length - ONE
    ) {
      const chars: string[] = Array.from(WORD_TO_FIND, (_, index) =>
        data.get(rowIndex + index, columnIndex - index),
      ).filter((v): v is string => v !== undefined);

      count += Number(isXmasString(chars));
      logger.log(`Checked diagonally dl - ${count}`);
    }

    // look diagonally up and to the right
    if (
      rowIndex >= WORD_TO_FIND.length - ONE &&
      columnIndex <= data.columns - WORD_TO_FIND.length
    ) {
      const chars: string[] = Array.from(WORD_TO_FIND, (_, index) =>
        data.get(rowIndex - index, columnIndex + index),
      ).filter((v): v is string => v !== undefined);

      count += Number(isXmasString(chars));
      logger.log(`Checked diagonally tr - ${count}`);
    }

    // look diagonally up and to the left
    if (
      rowIndex >= WORD_TO_FIND.length - ONE &&
      columnIndex >= WORD_TO_FIND.length - ONE
    ) {
      const chars: string[] = Array.from(WORD_TO_FIND, (_, index) =>
        data.get(rowIndex - index, columnIndex - index),
      ).filter((v): v is string => v !== undefined);

      count += Number(isXmasString(chars));
      logger.log(`Checked diagonally tl - ${count}`);
    }
  });

  return count;
}

export function transformInput(inputs: string[]): DayInputs {
  return new Matrix(inputs.map((line) => [...line]));
}

function isXmasString(letters: string[]): boolean {
  if (letters.length > WORD_TO_FIND.length)
    throw new TypeError("Expected to be passed four or fewer characters");
  if (letters.length < WORD_TO_FIND.length) return false;
  return letters.join("").toLowerCase() === WORD_TO_FIND.toLowerCase();
}
