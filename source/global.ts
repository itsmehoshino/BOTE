import utils from "@ax-plugins/utils";
import { AxionResponse } from "@ax-handler/response/response";
import { API, Message } from "ws3-fca";
import EventEmitter from "events";

declare global {
  export type Appstate = typeof import("../state.json");
  export type AxionConfig = typeof import("../settings.json");

  /**
   * AxionNS Namespace
   * ========
   * Contains most of types/interfaces important for Axion to work.
   */
  export namespace AxionNS {
    export interface Command {
      meta: CommandMeta;
      /**
       * This runs every time the command/cmd were invoked
       * This does NOT allow return values.
       * Must be an async function or must return a Promise<void>
       * @param ctx - Contains response, and other interaction objects.
       */
      onCall(ctx: CommandContext): Promise<void>;
    }
    export interface CommandMeta {
      /**
       * Self-explanatory, the MAIN name of the command
       * Must have NO SPACES, everything must be LOWERCASE, do not use hypens (-)
       */
      name: string;
      /**
       * Array of other names of the command
       * Must have NO SPACES, everything must be LOWERCASE, do not use hypens (-)
       */
      aliases?: string[];
      /**
       * Anything that describes the command.
       */
      description: string;
      /**
       * Array<string> of github usernames of the programmers who contributed to this command.
       */
      author: string[];
      /**
       * True - the command calls with/without a prefix
       * False - the command calls with a prefix
       * Both - same as True
       */
      noPrefix?: true | false | "both";
    }
    export interface CCall {
      argsAt(index: number, split?: string): string;
      event: CommandContext["event"];
      hasPrefix: boolean;
      commandName: string;
      currentCommand: null | Command;
    }
    export interface CommandContext {
      response: AxionResponse;
      api: API;
      event: Omit<Message, "type"> & { type: "message" | "messageReply" };
      ccall: CCall;
    }
    export interface Cooldown {}
    export interface Reply {}
    export interface EventCommand {}
    export interface Config extends AxionConfig {}
    export interface Global {
      /**
       * API exposed globally.
       */
      api: API;
      /**
       * Real-time JSON Data for settings.json
       */
      get config(): AxionConfig;
      /**
       * Overrides settings.json real-time
       */
      set config(config: AxionConfig);
      cooldown: Map<string, Cooldown>;
      /**
       * Map of commands (reusable)
       */
      commands: Map<string, Command>;
      replies: Map<string, Reply>;
      events: Map<string, EventCommand>;
      /**
       * All utilities.
       */
      utils: typeof utils;
      /**
       * Registers a VALID command with type-safety.
       * Must obey the correct command structure.
       */
      registerCmd(cmd: Command): ReturnType<typeof utils.registerCommand>;
    }
  }

  var Axion: AxionNS.Global;

  var bot: EventEmitter;

  var log: typeof log2;
}

import { log as log2 } from "@ax-ui/custom";

export default " : ) ";
