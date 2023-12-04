import { ONE } from "@lib/constants";
import { Stack } from "@lib/data-structures/stack";
import { rotate } from "@lib/matrix";

type Stacks = Record<number, Stack<string>>;
interface Instruction {
  from: number;
  to: number;
}
type DayInputs = [Stacks, Instruction[]];

export default function main(inputs: DayInputs): string {
  const [stacks, instructions] = inputs;

  instructions.forEach(({ from, to }) => {
    if (stacks[from].peek() !== null) {
      stacks[to].push(stacks[from].pop() as string);
    }
  });

  return Object.values(stacks)
    .map((stack) => stack.peek())
    .join("");
}

export function transformInput(inputs: string[]): DayInputs {
  const [drawing, steps] = inputs
    .join("\n")
    .split("\n\n")
    .map((entry) => entry.split("\n"));

  const drawingOffset = 4;
  const stackNumbers =
    drawing.pop()?.split(" ").filter(Boolean).map(Number) ?? [];
  const stacks: Stacks = Object.fromEntries(
    stackNumbers.map((current) => [current, new Stack()]),
  );

  const stackList = rotate(
    drawing.map((row) =>
      [...row].filter((_, index) => index % drawingOffset === ONE),
    ),
  );
  stackList.forEach((stack, index) => {
    stack
      .filter((value) => Boolean(value.trim()))
      .reverse()
      .forEach((value) => {
        stacks[index + ONE].push(value);
      });
  });

  const instruction =
    /move\s+(?<count>\d+)\s+from\s+(?<from>\d)+\s+to\s+(?<to>\d+)/;
  const procedure: Instruction[] = steps.filter(Boolean).flatMap((step) => {
    const stepMatch = instruction.exec(step);
    if (
      !stepMatch?.groups ||
      !stepMatch.groups.count ||
      !stepMatch.groups.from ||
      !stepMatch.groups.to
    ) {
      throw new Error(
        `Could not extract the metadata from instruction ${step}`,
      );
    }
    const { count, from, to } = stepMatch.groups;
    return Array.from({ length: Number(count) }, () => ({
      from: Number(from),
      to: Number(to),
    }));
  });

  return [stacks, procedure];
}
