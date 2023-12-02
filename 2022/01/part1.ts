type DayInputs = (number | undefined)[];

export default function main(inputs: DayInputs): unknown {
  return inputs.reduce(
    ({ currentElf, max }, calories) => {
      if (typeof calories !== "number") {
        return { currentElf: 0, max };
      }
      return {
        currentElf: currentElf + calories,
        max: Math.max(max, currentElf + calories),
      };
    },
    {
      currentElf: 0,
      max: 0,
    },
  ).max;
}

export function transformInput(inputs: string[]): DayInputs {
  return inputs.map((input) => {
    const value = Number.parseInt(input, 10);
    return Number.isNaN(value) ? undefined : value;
  });
}
