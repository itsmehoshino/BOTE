import { promisify } from "util";
import { log } from "@ax-ui/custom";
import { API, MessageObject } from "ws3-fca";
import { autoBold } from "@nea-liane/styler";
export function normalizeForm(form: string | MessageObject): MessageObject {
  if (typeof form === "string") {
    return {
      body: form,
    }
  }
  return typeof form === "object" && form ? { ...form } : {}
}
export class AxionResponse {
  private event: AxionNS.CommandContext["event"];
  private sendMessage;
  private editMessage;

  constructor(api: API, event: AxionNS.CommandContext["event"]) {
    if (
      !api ||
      !event ||
      !event.threadID ||
      typeof api.sendMessage !== "function" ||
      typeof api.editMessage !== "function"
    ) {
      log("ERROR", "Invalid Response initialization");
      throw new Error("Invalid Response initialization");
    }
    this.event = event;
    this.sendMessage = promisify(api.sendMessage.bind(api));
    this.editMessage = promisify(api.editMessage.bind(api));
  }

  async send(message: string | MessageObject, goal: string) {
    if (!message || (!goal && !this.event.threadID)) {
      log("ERROR", "Invalid message or threadID");
      throw new Error("Invalid message or threadID");
    }
    try {
      const threadID = goal || this.event.threadID;
      let formattedMessage = normalizeForm(message);
      if (formattedMessage.body) {
        formattedMessage.body = autoBold(formattedMessage.body);
      }
      const result = await this.sendMessage(formattedMessage, threadID, undefined);
      log("INFO", `Sent message to thread ${threadID}`);
      return { ...result };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      log("ERROR", `Failed to send message: ${errorMessage}`);
      throw err;
    }
  }

  async setReply(message: string | MessageObject, goal: string = this.event.threadID) {
    if (!message || (!goal && !this.event.threadID)) {
      log("ERROR", "Invalid message or threadID");
      throw new Error("Invalid message or threadID");
    }
    try {
      const threadID = goal || this.event.threadID;
      let formattedMessage = normalizeForm(message);
      if (formattedMessage.body) {
        autoBold(formattedMessage.body);
      }
      const result = await this.sendMessage(formattedMessage, threadID, undefined);
      log("INFO", `Set reply message to thread ${threadID}`);
      const messageID = result?.messageID;
      return {
        ...result,
        messageID,
        replies: (callback: AxionNS.Reply) => {
          if (typeof callback !== "function") {
            log("ERROR", "Invalid reply callback");
            throw new Error("Invalid reply callback");
          }
          if (messageID) {
            Axion.replies.set(messageID, callback);
            log("INFO", `Registered reply handler for message ID ${messageID}`);
            const ttl = 1000 * 60 * 5;
            setTimeout(() => Axion.replies.delete(messageID), ttl);
          } else {
            log(
              "WARNING",
              "No messageID returned; reply handler not registered",
            );
          }
        },
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      log("ERROR", `Failed to set reply message: ${errorMessage}`);
      throw err;
    }
  }

  async reply(message: string | MessageObject, goal: string = this.event.threadID) {
    if (!message || (!goal && !this.event.threadID)) {
      log("ERROR", "Invalid reply message or threadID");
      throw new Error("Invalid reply message or threadID");
    }
    try {
      const threadID = goal || this.event.threadID;
      let formattedMessage = normalizeForm(message);
      if (formattedMessage.body) {
        formattedMessage.body = autoBold(formattedMessage.body);
      }
      const result = await this.sendMessage(
        formattedMessage,
        threadID,
        this.event.messageID,
      );
      log("INFO", `Sent reply to thread ${threadID}`);
      return { ...result };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      log("ERROR", `Failed to send reply: ${errorMessage}`);
      throw err;
    }
  }

  async edit(msg: string, mid: string) {
    if (!msg || !mid) {
      log("ERROR", "Invalid message or messageID");
      throw new Error("Invalid message or messageID");
    }
    try {
      const result = await this.editMessage(msg, mid);
      log("INFO", `Edited message ${mid}`);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      log("ERROR", `Failed to edit message: ${errorMessage}`);
      throw err;
    }
  }
}
