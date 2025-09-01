Axion.registerCmd({
  meta: {
    name: "help",
    author: ["lianecagara"],
    description: "Just a simple help list.",
    noPrefix: "both",
    aliases: ["menu", "h"],
  },
  async onCall({ response, ccall }) {
    const cmds = Array.from(Axion.commands.values()).filter(
      (cmd) => cmd && cmd.meta,
    );
    if (ccall.argsAt(0)) {
      const targ = cmds.find(
        (cmd) =>
          cmd.meta.name === ccall.argsAt(0).toLowerCase() ||
          (cmd.meta.aliases ?? []).includes(ccall.argsAt(0).toLowerCase()),
      );
      if (targ) {
        return response.reply(
          `**${targ.meta.name.toUpperCase()}**\n\n- ${targ.meta.description}\n\n**Author Usernames (Github)**:\n${(targ.meta.author ?? []).join("\n")}`,
        );
      }
    }

    const strMap = cmds
      .map(
        (cmd) =>
          `${Axion.config.prefix}\`${cmd.meta.name}\` - ${cmd.meta.description}`,
      )
      .join("\n");
    response.reply(`**Axion CMDS**\n\n${strMap}`);
  },
});

export { Axion };
