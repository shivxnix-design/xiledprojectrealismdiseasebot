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
        type: 1,
        name: "expose",
        description: "Roll infection chance",
        options: [
          {
            type: 3,
            name: "attacker",
            description: "What attacked you",
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
        description: "Resolve infection",
        options: []
      }
    ]
  },
  {
    name: "infection",
    description: "Injury-based infection system",
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

    console.log("Commands registered.");
  } catch (error) {
    console.error(error);
  }
})();