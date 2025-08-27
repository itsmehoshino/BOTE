import utils from "@ax-plugins/utils";

declare global {
  type AxionConfig = typeof import("../settings.json");

  /**
   * AxionNS Namespace
   * ========
   * Contains most of types/interfaces important for Axion to work.
   */
  export namespace AxionNS {
    export interface Command {
      meta: CommandMeta;
    }
    export interface CommandMeta {
      /**
       * Self-explanatory, the name of the command
       * Must have NO SPACES, everything must be LOWERCASE, do not use hypens (-)
       */
      name: string;
      description: string;
      author: string[];
      noPrefix?: true | false | "both";
      /**
       * This runs every time the command/cmd were invoked
       * This does NOT allow return values.
       * Must be an async function or must return a Promise<void>
       * @param ctx - Contains response, and other interaction objects.
       */
      onCall(ctx: CommandContext): Promise<void>;
    }
    export interface CommandContext {
      response: unknown; // where is it?
    }
    export interface Cooldown {}
    export interface Reply {}
    export interface EventCommand {}
    export interface Config extends AxionConfig {}
    export interface Global {
      get config(): AxionConfig;
      set config(config: AxionConfig);
      cooldown: Map<string, Cooldown>;
      commands: Map<string, Command>;
      replies: Map<string, Reply>;
      events: Map<string, EventCommand>;
      utils: typeof utils;
    }
  }

  var Axion: AxionNS.Global;
}

export default " : ) ";
