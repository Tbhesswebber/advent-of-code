import { mkdir, readFile, writeFile } from "node:fs/promises";

import { ONE, ZERO } from "@lib/constants";

import { jsonify } from "../../lib/format";
import { getProblemInput } from "../libs/aoc";
import { Part } from "../libs/constants";
import { writeFileIfNotExists } from "../libs/node/fs";
import {
  getInputPath,
  getOutputPath,
  getResultPath,
  getSolutionPath,
  getTestInputPath,
} from "../libs/node/path";
import { ChristmasError } from "../libs/oops/christmas-error";
import { InputError } from "../libs/oops/input-error";
import {
  emptyFileTemplate,
  emptyJsonFileTemplate,
  solutionFileTemplate,
} from "../libs/templates";

import type { SolutionModule } from "../../global";

interface Config<TShouldFetch extends boolean = false> {
  fetch?: TShouldFetch extends true ? boolean : never;
  force?: boolean;
}

export class AoC {
  readonly ideCommand: string = "code";

  readonly results: Record<Part, number | undefined> = {
    [Part.One]: undefined,
    [Part.Two]: undefined,
  };

  protected day: number;

  protected year: number;

  constructor(date: Date, ideCommand?: string) {
    if (!ChristmasError.validateDate(date)) {
      throw new ChristmasError(date);
    }
    this.day = date.getDate();
    this.year = date.getFullYear();
    this.ideCommand = ideCommand ?? this.ideCommand;
  }

  get folderPath(): string {
    return getOutputPath(this.year, this.day);
  }

  get inputPath(): string {
    return getInputPath(this.year, this.day);
  }

  get inputUrl(): string {
    return `https://adventofcode.com/${this.year}/day/${this.day}/input`;
  }

  get part1Result(): number | undefined {
    return this.results[Part.One];
  }

  get part1SolutionPath(): string {
    return getSolutionPath(this.year, this.day, Part.One);
  }

  get part2Result(): number | undefined {
    return this.results[Part.Two];
  }

  get part2SolutionPath(): string {
    return getSolutionPath(this.year, this.day, Part.Two);
  }

  get problemUrl(): string {
    return `https://adventofcode.com/${this.year}/day/${this.day}`;
  }

  get resultPath(): string {
    return getResultPath(this.year, this.day);
  }

  get testInputPath(): string {
    return getTestInputPath(this.year, this.day);
  }

  async createDirectory(): Promise<string> {
    await mkdir(this.folderPath, { recursive: true });
    return this.folderPath;
  }

  async createInputFile({ force, fetch }: Config<true> = {}): Promise<string> {
    let inputFileContents: string | null = emptyFileTemplate;
    if (fetch === true) {
      inputFileContents = await getProblemInput(this.year, this.day);
    }
    await writeFileIfNotExists(
      this.inputPath,
      inputFileContents ?? emptyFileTemplate,
      force,
    );

    return this.inputPath;
  }

  async createResultFile({ force }: Config): Promise<string> {
    await writeFileIfNotExists(
      getResultPath(this.year, this.day),
      emptyJsonFileTemplate,
      force,
    );
    return this.testInputPath;
  }

  async createSolutionFile(part: Part, { force }: Config): Promise<string> {
    const filePath =
      part === Part.One ? this.part1SolutionPath : this.part2SolutionPath;
    await writeFileIfNotExists(filePath, solutionFileTemplate, force);
    return filePath;
  }

  async createTestInputFile({ force }: Config): Promise<string> {
    await writeFileIfNotExists(this.testInputPath, emptyFileTemplate, force);
    return this.testInputPath;
  }

  async run(part: Part, inputPath?: string): Promise<number | null> {
    const rawValues = await readFile(inputPath ?? this.inputPath, {
      encoding: "utf8",
    });
    const values = rawValues.trim().split("\n");

    if (values.length === ONE && values[ZERO].length === ZERO) {
      throw new InputError(values);
    }

    const solutionPath =
      part === Part.One ? this.part1SolutionPath : this.part2SolutionPath;
    const { solution, transform } = await import(solutionPath).then(
      (module: SolutionModule<unknown[]>) => ({
        solution: (transformedInputs: unknown[]) =>
          module.default(transformedInputs),
        transform: (rawInput: string[]) =>
          module.transformInput === undefined
            ? rawInput
            : module.transformInput(rawInput),
      }),
    );

    this.results[part] = solution(transform(values));

    return this.results[part];
  }

  async saveResults(): Promise<void> {
    await writeFile(this.resultPath, jsonify(this.results));
  }

  async setupFileStructure({ fetch, force }: Config<true> = {}): Promise<void> {
    await this.createDirectory();
    await Promise.all([
      this.createInputFile({ force, fetch }),
      this.createTestInputFile({ force }),
      this.createResultFile({ force }),
      this.createSolutionFile(Part.One, { force }),
      this.createSolutionFile(Part.Two, { force }),
    ]);
  }
}
