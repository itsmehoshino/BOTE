import { log } from "@ax-ui/custom";
import utils from "@ax-plugins/utils";
import { login } from "@ax-login/facebook-login";

export default async function starter(){
  log("AXION", "Starting Axion...");
  log("AXION", "Running on version " + process.version);
  log("AXION", "Running on platform " + process.platform);
  log("AXION", "Loading Commands");
  utils.loadCommands();
  log("AXION", "Loading Events");
  utils.loadEvents();
  log("AXION", "Logging in..");
  login();
}