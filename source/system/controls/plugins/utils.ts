import { join } from "path";
import { readdir } from "fs/promises";
import { log } from "@ax-ui/custom";

const utils = {
  async loadCommands() {
    const commandsPath = join(process.cwd(), "axion", "modules", "commands");
    log("DEBUG", `Loading commands from ${commandsPath}`);
    const loadFiles = await readdir(commandsPath);
    const commands = loadFiles.filter((file) => file.endsWith(".ts"));
    if (commands.length === 0) {
      log("AXION", "No available commands found.");
      return;
    }
    for (const file of commands) {
      const commandPath = join(commandsPath, file);
      try {
        await import(commandPath);
        log("SCAN", `Scanned ${file}`);
      } catch (err) {
        console.error(
          typeof err === "object" && err && "stack" in err ? err.stack : err,
        );
      }
    }
  },
  registerCommand(command: AxionNS.Command) {
    if (!command || !command.meta) {
      throw new TypeError("Malformed/Incomplete Command");
    }
    const { meta, onCall } = command;
    meta.author ??= [];
    meta.aliases ??= [];
    meta.description ??= "";
    meta.noPrefix ??= false;
    if (!meta?.name || typeof onCall !== "function") {
      throw new TypeError(
        "The command is missing meta.name and a correct oncall function",
      );
    }
    Axion.commands.set(meta.name, command);
  },

  async loadEvents() {},
};

export default utils;
