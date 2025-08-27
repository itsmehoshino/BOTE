import path from "path";
import fs from "fs-extra";
import utils from "@ax-plugins/utils";
import { log } from "@ax-ui/custom";
import starter from "@ax-ui/console";
import EventEmitter from "events";
import "./global";

const bot = new EventEmitter();
globalThis.bot = bot;

process.on("unhandledRejection", (error) => log("ERROR", error));
process.on("uncaughtException", (error) => log("ERROR", error.stack));

globalThis.Axion = {
  get config(): AxionNS.Config {
    try {
      return JSON.parse(
        fs.readFileSync(path.join(__dirname, "..", "settings.json"), "utf8"),
      ) as AxionConfig;
    } catch (error) {
      log("ERROR", error);
      return {
        administrators: [],
        blacklist: [],
        developers: [],
        moderators: [],
        prefix: "",
        subprefix: "",
      };
    }
  },
  set config(config: AxionConfig) {
    const data = globalThis.Axion.config;
    const newData = { ...data, ...config };
    const str = JSON.stringify(newData, null, 2);
    fs.writeFileSync(path.join(__dirname, "settings.json"), str);
  },
  cooldown: new Map(),
  commands: new Map(),
  replies: new Map(),
  events: new Map(),
  utils: utils,
};

async function main() {
  await starter();
}

main();
