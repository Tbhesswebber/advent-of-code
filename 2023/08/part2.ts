import chalk from "chalk";

import { ONE, ZERO } from "@lib/constants";
import { CircularLinkedList } from "@lib/data-structures/circular-linked-list";
import { log } from "@lib/logger";
import { lowestCommonMultiple } from "@lib/math";

interface DayInputs {
  directions: CircularLinkedList<Direction>;
  paths: Map<string, Record<Direction, string>>;
}

enum Direction {
  L = "left",
  R = "right",
}

function followPath(
  key: string,
  paths: Map<string, Record<Direction, string>>,
  direction: Direction,
) {
  const value = paths.get(key);

  if (value === undefined) {
    throw new Error(`The ${direction} path of ${key} leads nowhere!`);
  }

  if (key.endsWith("Z")) log(chalk.bold.red(key));

  return value[direction];
}

export default function main({ directions, paths }: DayInputs): number {
  const currentLocation = [...paths.keys()].filter((key) => key.endsWith("A"));
  let direction = directions.head;
  let steps = ZERO;
  const zSteps = Array.from(currentLocation, (): number[] => []);
  const minimumValuesNeeded = 2;

  while (zSteps.some((z) => z.length < minimumValuesNeeded)) {
    steps += ONE;
    log(chalk.green(steps));
    log(chalk.blue(currentLocation));
    if (direction === null) {
      throw new Error("We're directionless!!");
    }

    for (let index = ZERO; index < currentLocation.length; index += ONE) {
      currentLocation[index] = followPath(
        currentLocation[index],
        paths,
        direction.value,
      );

      if (currentLocation[index].endsWith("Z")) {
        zSteps[index].push(steps);
      }
    }

    direction = direction.next;
  }

  return (
    lowestCommonMultiple(zSteps.map((path) => path[ONE] - path[ZERO])) ??
    Number.NEGATIVE_INFINITY
  );
}

export function transformInput(inputs: string[]): DayInputs {
  const directions = [...inputs[ZERO]]
    .filter((value): value is keyof typeof Direction =>
      ["L", "R"].includes(value),
    )
    .reduce((circularLinkedList, currentDirection) => {
      return circularLinkedList.insert(Direction[currentDirection]);
    }, new CircularLinkedList<Direction>());

  const rawPaths = inputs.slice(ONE).filter(Boolean);
  const paths = rawPaths
    .map((line) => {
      return /(?<value>\w{3})\s+=\s+\((?<left>\w{3}), (?<right>\w{3})\)/.exec(
        line,
      )?.groups as { left: string; right: string; value: string };
    })
    .reduce<Map<string, Record<Direction, string>>>((tree, currentPath) => {
      // eslint-disable-next-line no-param-reassign -- we create this within this code block
      tree.set(currentPath.value, {
        left: currentPath.left,
        right: currentPath.right,
      });
      return tree;
    }, new Map<string, Record<Direction, string>>());

  return { directions, paths };
}
