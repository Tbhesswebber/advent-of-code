import chalk from "chalk";

import { ONE, ZERO } from "@lib/constants";
import { log } from "@lib/logger";
import { arraySum } from "@lib/math";

import { hash } from "./commons";

type DayInputs = string[];

enum Operation {
  RemoveLens = "-",
  UpsertLens = "=",
}

interface Lens {
  focalLength: number;
  label: string;
}

const stepMatch = /^(?<label>[A-z]+)(?<operation>=|-)(?<focalLength>\d*)/;

export default function main(inputs: DayInputs): number {
  const boxes: Lens[][] = Array.from({ length: 256 }, () => []);

  inputs.forEach((step) => {
    const { label, operation, focalLength } = (stepMatch.exec(step)?.groups ||
      {}) as Record<string, string> & { operation: Operation };
    const boxNumber = hash(label);

    log(chalk.green.bold(operation));

    if (operation === Operation.RemoveLens) {
      removeLens(boxes[boxNumber], label);
    }
    if (operation === Operation.UpsertLens) {
      upsertLens(boxes[boxNumber], {
        label,
        focalLength: Number(focalLength),
      });
    }
  });

  const focusingPowers = boxes.flatMap((box, boxNumber) => {
    return box.map(({ focalLength }, slotLessOne) => {
      return (boxNumber + ONE) * (slotLessOne + ONE) * focalLength;
    });
  });

  return arraySum(focusingPowers);
}

export function transformInput(inputs: string[]): DayInputs {
  return inputs.join(",").split(",").filter(Boolean);
}

function removeLens(box: Lens[], label: string) {
  const lensIndex = box.findIndex(
    ({ label: currentLabel }) => currentLabel === label,
  );

  if (lensIndex >= ZERO) {
    box.splice(lensIndex, ONE);
  }
}

function upsertLens(box: Lens[], lens: Lens) {
  const lensIndex = box.findIndex(({ label }) => label === lens.label);
  if (lensIndex >= ZERO) {
    box.splice(lensIndex, ONE, lens);
  } else {
    box.push(lens);
  }
}
