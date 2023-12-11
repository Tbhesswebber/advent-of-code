import { exec } from "node:child_process";
import { mkdir } from "node:fs/promises";

import { Part } from "../constants";
import { getProblemInput } from "../libs/aoc";
import { openBrowser } from "../libs/exec";
import { writeFileIfNotExists } from "../libs/fs";
import { ChristmasError } from "../libs/oops/christmas-error";
import {
  getInputPath,
  getOutputPath,
  getResultPath,
  getSolutionPath,
  getTestInputPath,
} from "../libs/output";
import {
  emptyFileTemplate,
  emptyJsonFileTemplate,
  solutionFileTemplate,
} from "../templates";

import type { ChildProcess } from "node:child_process";

interface Config<TShouldFetch extends boolean = false> {
  fetch?: TShouldFetch extends true ? boolean : never;
  force?: boolean;
}

export class AoC {
  readonly ideCommand: string = "code";

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

  get part1SolutionPath(): string {
    return getSolutionPath(this.year, this.day, Part.One);
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

  openIde(command?: string): ChildProcess {
    return exec(`${command ?? this.ideCommand} ${this.part1SolutionPath}`);
  }

  openProblemSite(): ChildProcess {
    return openBrowser(`https://adventofcode.com/${this.year}/day/${this.day}`);
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
