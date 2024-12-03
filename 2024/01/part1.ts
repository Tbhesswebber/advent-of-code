type DayInputs = [number[], number[]];

export default function main([left, right]: DayInputs): number {
  const init = 0;
  return left.reduce(
    (sum, current, index) => sum + Math.abs(current - right[index]),
    init,
  );
}

export function transformInput(inputs: string[]): DayInputs {
  const left: number[] = [];
  const right: number[] = [];
  inputs.forEach((line) => {
    const [l, r] = line.split(/\s+/).map((value) => Number.parseInt(value, 10));
    left.push(l);
    right.push(r);
  });
  return [left.sort((a, b) => a - b), right.sort((a, b) => a - b)];
}
