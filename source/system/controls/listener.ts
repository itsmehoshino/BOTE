import { AxionResponse } from "@ax-handler/response/response";

export async function messageListener(
  api: AxionNS.CommandContext["api"],
  event: AxionNS.CommandContext["event"],
) {
  if (event.type === "message" || event.type === "messageReply") {
    let [commandName, ..._arg] = `${event.body ?? ""}`
      .split(" ")
      .filter(Boolean);
    commandName = `${commandName ?? ""}`.trim();
    const config = Axion.config;
    const hasPrefix = commandName.startsWith(config.prefix);
    if (hasPrefix) {
      commandName = commandName.replace(config.prefix, "");
    }
    commandName = commandName.toLowerCase().trim();
    const argsAt = (index: number, split?: string) =>
      (split
        ? _arg
            .join(" ")
            .split(split)
            .map((i) => i.trim())
        : _arg
      ).at(index) ?? "";
    const response = new AxionResponse(api, event);
    const ccall: AxionNS.CCall = {
      event,
      argsAt,
      hasPrefix,
      commandName,
      currentCommand: null,
    };
    const context: AxionNS.CommandContext = {
      api,
      event,
      response,
      ccall,
    };
    const command = [...Axion.commands.values()].find(
      (i) =>
        commandName === `${i?.meta?.name}`.toLowerCase() ||
        (i?.meta?.aliases ?? []).some(
          (alias) => `${alias}`.toLowerCase() === commandName,
        ),
    );
    if (command !== undefined) {
      ccall.currentCommand = command;
      try {
        await command.onCall(context);
      } catch (err) {
        log("COMMANDERR", err);
      }
    }
  }
}
