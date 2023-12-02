#!/usr/bin/env tsx

import { Command, program } from "commander";

import * as commands from "./cli/commands";

Object.entries(commands).forEach(([, command]) => {
  if (command instanceof Command) {
    program.addCommand(command);
  }
});

program.parse(process.argv);
