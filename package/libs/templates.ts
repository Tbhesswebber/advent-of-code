export const emptyFileTemplate = "";

export const emptyJsonFileTemplate = "{}";

export const solutionFileTemplate = `type DayInputs = ReturnType<typeof transformInput>;

export default function main(inputs: DayInputs): number {
  throw new Error("Not yet implemented");
}

export function transformInput(inputs: string[]) {
    return inputs;
}`;
