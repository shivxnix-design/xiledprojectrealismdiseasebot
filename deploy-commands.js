require("dotenv").config();
const { REST, Routes } = require("discord.js");

// Load environment variables
const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

if (!TOKEN || !CLIENT_ID || !GUILD_ID) {
  console.error("Missing TOKEN, CLIENT_ID, or GUILD_ID in .env");
  process.exit(1);
}

// Define your slash commands
const commands = [
  {
    name: "disease",
    description: "Disease system",
    options: [
      {
        type: 1, // Subcommand
        name: "expose",
        description: "Roll to see if you develop a condition after surviving an attack",
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
          },
          {
            type: 3, // String option
            name: "dinosaur",
            description: "Your dinosaur type",
            required: true,
            choices: [
              { name: "Sauropod", value: "sauropod" },
              { name: "Other", value: "other" }
            ]
          }
        ]
      },
      {
        type: 1, // Subcommand
        name: "outcome",
        description: "Determine the outcome of your current condition",
        options: []
      }
    ]
  }
];

const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  try {
    console.log("Clearing all guild commands...");

    // Remove all existing commands from the guild
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: [] });

    console.log("Registering new guild commands...");

    // Deploy new commands to your guild
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );

    console.log("Successfully registered guild commands!");
  } catch (error) {
    console.error("Error registering commands:", error);
  }
})();