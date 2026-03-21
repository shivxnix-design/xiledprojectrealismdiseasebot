require("dotenv").config();
const { REST, Routes } = require("discord.js");

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

// Define your slash commands
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
            description: "The dinosaur you survived",
            required: true,
            choices: [
              { name: "Megalania", value: "meg" },
              { name: "Metricanthosaurus", value: "metri" }
            ]
          }
        ]
      },
      {
        type: 1, // Subcommand
        name: "outcome",
        description: "Roll the outcome of an infection you already have",
        options: []
      }
    ]
  }
];

const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  try {
    console.log("Clearing all global commands...");

    // Remove all existing global commands
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: [] });

    console.log("Registering new global commands...");

    // Deploy new commands globally
    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commands }
    );

    console.log("Successfully registered global commands!");
  } catch (error) {
    console.error("Error registering commands:", error);
  }
})();