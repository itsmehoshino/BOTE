import { login } from "./ws3-fca/module/index";
import { readFile } from "fs/promises";

let credentials;

async function appState() {
  if (!credentials) {
    credentials = JSON.parse(await readFile(process.cwd() + "/../appstate.json", "utf8"));
  }
  return credentials;
}

export async function facebookLogin() {
  const { config } = globalThis.Sypher;
  login(await appState(), {
    listenEvents: config.setOptions.listenEvents,
    userAgent: config.setOptions.userAgent,
    autoMarkRead: config.setOptions.autoMarkRead,
    autoMarkDelivery: config.setOptions.autoMarkDelivery,
    selfListen: config.setOptions.selfListen
  }, (err, api) => {
    if (err) return utils.error(err);
    api.listenMqtt((err, event) => {
      if (err) return;
      api.sendMessage(event.body, event.threadID);
    });
  });
}