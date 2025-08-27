import path from "path";
import fs from "fs-extra";
import { promisify } from "util";
import { log } from "@ax-ui/custom";
import { listener } from "@ax-sys/listener";

import fca from "facebook-chat-api";
fca.logging(false);
const loginPromisified = promisify(fca.login);

export async function login() {
  try {
    log("FACEBOOK", "Logging in...");
    const cookiesPath = path.join(__dirname, "..", "..", "..", "cookies.json");
    if (!fs.existsSync(cookiesPath)) {
      throw new Error("cookies.json file not found");
    }
    const appState = JSON.parse(fs.readFileSync(cookiesPath, "utf-8"));
    if (Array.isArray(appState) && appState.length === 0) {
      throw new Error("No Appstate provided");
    }
    const config = globalThis.Axion;
    const api = await loginPromisified(
      { appState },
      {
        listenEvents: config.fcaOptions.listenEvents,
        forceLogin: config.fcaOptions.forceLogin,
        selfListen: config.fcaOptions.selfListen,
        userAgent: config.fcaOptions.userAgent,
        autoReconnect: config.fcaOptions.autoReconnect,
        autoMarkDelivery: config.fcaOptions.autoMarkDelivery,
      }
    );
    api.listenMqtt((err, event) => {
      if (err) {
        const errorMessage = err.error || err.message || String(err);
        log("ERROR", `MQTT error: ${errorMessage}`);
        return;
      }
      listener({ api, event });
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return api;
  } catch (error) {
    const errorMessage = error.error || error.message || String(error);
    log("FACEBOOK", `Login failed: ${errorMessage}`);
  }
}