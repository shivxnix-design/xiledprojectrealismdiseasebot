require("dotenv").config();
const { REST, Routes } = require("discord.js");

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

if (!TOKEN || !CLIENT_ID || !GUILD_ID) {
  console.error("Missing TOKEN, CLIENT_ID, or GUILD_ID in .env");
  process.exit(1);
}

const commands = [
  {
    name: "disease",
    description: "Disease system",
    options: [
      {
        type: 1, // Subcommand
        name: "expose",
        description: "Roll to see if you get infected after surviving an attack",
        options: [
          {
            type: 3, // String option
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
        description: "Roll the outcome of an infection you already have",
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
        description: "Apply a bone infection",
        options: []
      },
      {
        type: 1,
        name: "outcome",
        description: "Resolve bone infection outcome",
        options: []
      }
    ]
  }
];

const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  try {
    console.log("Registering slash commands...");

    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );

    console.log("Commands registered successfully!");
  } catch (error) {
    console.error("Error registering commands:", error);
  }
})();