require("dotenv").config();
const { REST, Routes } = require("discord.js");

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const commands = [
  {
    name: "disease",
    description: "Disease system",
    options: [
      {
        type: 1, // Subcommand
        name: "expose",
        description: "Roll infection chance from attacker",
        options: [
          {
            type: 3,
            name: "attacker",
            description: "The dinosaur that attacked you",
            required: true,
            choices: [
              { name: "Megalania", value: "meg" },
              { name: "Metricanthosaurus", value: "metri" }
            ]
          }
        ]
      },
      {
        type: 1,
        name: "outcome",
        description: "Resolve infection outcome",
        options: []
      }
    ]
  },
  {
    name: "infection",
    description: "Sauropod bone infection system",
    options: [
      {
        type: 1,
        name: "apply",
        description: "Apply bone infection",
        options: []
      },
      {
        type: 1,
        name: "outcome",
        description: "Resolve bone infection",
        options: []
      }
    ]
  }
];

const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );
    console.log("Commands registered successfully.");
  } catch (error) {
    console.error("Error registering commands:", error);
  }
})();