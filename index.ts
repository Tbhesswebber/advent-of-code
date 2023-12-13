#!/usr/bin/env bun

import "dotenv/config";
import { heapStats } from "bun:jsc";
import { Command, program } from "commander";

import { ZERO } from "@lib/constants";

import * as commands from "./package/commands";
import { report } from "./package/libs/node/child-process";

Object.entries(commands).forEach(([, command]) => {
  if (command instanceof Command) {
    program.addCommand(command);
  }
});

process.on("beforeExit", (code) => {
  if (code > ZERO) {
    console.log(heapStats());
    report(["Christmas is in danger", `Program exited with exit code ${code}`]);
  }
});

program.parse(process.argv);
