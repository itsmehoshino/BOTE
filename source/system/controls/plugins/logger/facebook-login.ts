import Ws3 from "ws3-fca";
import { promisify } from "util";
const loginFunc = promisify(Ws3.login);
import { readFile } from "fs/promises";
export async function login() {
  try {
    const state: any[] = JSON.parse(
      await readFile(process.cwd() + "/state.json", "utf8"),
    ) as Appstate;
    const api = await loginFunc({
      appState: state,
    });
    if (!api) {
      throw new TypeError("Api ended up falsy.");
    }
    return api;
  } catch (err) {
    throw err;
  }
}
