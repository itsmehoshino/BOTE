import { resolve, join } from "path";
import { readdir } from "fs/promises";
import { promisify } from "util";
import { log } from "@ax-ui/custom";

const utils = {
  async loadCommands(){
    const commandsPath = resolve(__dirname, "@ax-handler/commands");
    log("DEBUG", `Loading commands from ${commandsPath}`);
    const loadFiles = await readdir(commandsPath);
    const commands = loadFiles.filter((file) => file.endsWith(".js") || file.endsWith(".ts"));
    if (commands.length === 0){
      log("AXION", "No available commands found.");
      return;
    }
    for (const file of commands){
      const commandPath = join(commandsPath, file);
      let command;
      try {
        command = import(commandPath);
        command = command.default || command;
        const { meta, execute } = command ?? {}
        if (!meta.name || typeof execute !== "function"){
          log("WARNING", `Missing function on file ${file}, Check your code.`);
          continue;
        }
        globalThis.Axion.commands.set(meta.name, command);
      }
    }
  },

  async loadEvents(){

  }
}

export default utils;