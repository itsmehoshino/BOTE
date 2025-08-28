import { log } from "@ax-ui/custom";
import utils from "@ax-plugins/utils";
import { login } from "@ax-login/facebook-login";
import { API } from "ws3-fca";
import { messageListener } from "@ax-sys/listener";

export default async function starter() {
  log("AXION", "Starting Axion...");
  log("AXION", "Running on version " + process.version);
  log("AXION", "Running on platform " + process.platform);
  log("AXION", "Loading Commands");
  utils.loadCommands();
  log("AXION", "Loading Events");
  utils.loadEvents();
  log("AXION", "Logging in..");

  try {
    Axion.api = await login();
  } catch (err) {}
  if (Axion.api) {
    (Axion.api.listenMqtt as API["listen"])((err, event) => {
      if (err) {
        log("LISTENERR", err);
        return;
      }
      messageListener(Axion.api, event);
    });
  }
}
