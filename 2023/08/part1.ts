import { ONE, ZERO } from "@lib/constants";
import { CircularLinkedList } from "@lib/data-structures/circular-linked-list";

interface DayInputs {
  directions: CircularLinkedList<Direction>;
  paths: Map<string, Record<Direction, string>>;
}

enum Direction {
  L = "left",
  R = "right",
}

export default function main({ directions, paths }: DayInputs): number {
  let current = "AAA";
  let direction = directions.head;
  let steps = ZERO;

  while (current !== "ZZZ") {
    steps += ONE;
    const currentOptions = paths.get(current);

    if (!currentOptions) {
      throw new Error(`Node ${current} has no associated value`);
    }
    if (!direction) {
      throw new Error(`Somehow direction is undefined`);
    }
    current = currentOptions[direction.value];
    direction = direction.next;
  }

  return steps;
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
