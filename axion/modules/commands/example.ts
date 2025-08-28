Axion.registerCmd({
  meta: {
    name: "example",
    author: ["lianecagara"],
    description: "This is an example",
    noPrefix: "both",
    aliases: ["ex", "test"],
  },
  async onCall({ response, ccall }) {
    
    if (Math.random() < 0.5) {
      response.reply("Hello, example.");
    } else {
      response.reply({
        body: "Hello, @Mark Zuckerberg",
        mentions: [
          {
            id: "4",
            tag: "@Mark Zuckerberg",
          },
        ],
      });
    }
  },
});

export { Axion };
