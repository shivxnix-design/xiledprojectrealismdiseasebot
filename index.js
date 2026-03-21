require("dotenv").config();
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const diseases = require("./diseases");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const DATA_PATH = "./data/infections.json";

// Load infections from JSON
function loadData() {
  return JSON.parse(fs.readFileSync(DATA_PATH));
}

// Save infections to JSON
function saveData(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

// Map variants to small thumbnail images
const variantThumbnails = {
  HRV2: "https://cdn.discordapp.com/attachments/1475249130283729100/1484910605436719224/Server_Edits-12_1.png?ex=69bff244&is=69bea0c4&hm=b2f3545c976e587f89181ac8b1e340d5da6d500f3481ed3817c2be16fbe6de08&",
  HRV_DELTA: "https://cdn.discordapp.com/attachments/1475249130283729100/1484910569734799360/Server_Edits-12.png?ex=69bff23c&is=69bea0bc&hm=54f2d5005240593f1aa1d0b3fae8324841d2771e59bd3192279ce651f0894a53&"
};

// Helper function to underline text
function underline(text) {
  return text.split("").map(c => c + "\u0332").join("");
}

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "disease") {
    const sub = interaction.options.getSubcommand();

    // -------------------
    // EXPOSE COMMAND
    // -------------------
    if (sub === "expose") {
      const data = loadData();

      if (data[interaction.user.id]) {
        return interaction.reply({
          content: "You already have an active infection. Use `/disease outcome` first.",
          ephemeral: true
        });
      }

      const attacker = interaction.options.getString("attacker");
      const attackerName = attacker === "meg" ? "Megalania" : "Metricanthosaurus";

      // 90% chance to be infected
      const infected = Math.random() < 0.9;

      if (!infected) {
        const embed = new EmbedBuilder()
          .setTitle("🧬 DISEASE EXPOSURE ALERT")
          .setColor(0x57F287)
          .setDescription(`You survived an attack from **${attackerName}**, and no infection developed.`)
          .addFields(
            { name: underline("User"), value: `<@${interaction.user.id}>`, inline: true },
            { name: underline("Attacker"), value: attackerName, inline: true }
          )
          .setFooter({ text: "Xiled Project Realism • Disease System" });

        return interaction.reply({ embeds: [embed] });
      }

      // Roll disease variant
      const diseaseKey = Math.random() < 0.7 ? "HRV2" : "HRV_DELTA";
      const disease = diseases[diseaseKey];

      // Save infection
      data[interaction.user.id] = { disease: diseaseKey };
      saveData(data);

      // Variant-specific next step
      let nextStepInstruction = diseaseKey === "HRV2"
        ? "Roleplay symptoms based on your dinosaur's profile, then type **!hrv2** in local chat."
        : "Roleplay symptoms based on your dinosaur's profile, then type **!hrvdelta** in local chat.";

      const embed = new EmbedBuilder()
        .setTitle("⚠️ WARNING: INFECTION CONTRACTED")
        .setColor(0xE6B800)
        .setDescription(`You have been infected by a **${attackerName}**.`)
        .addFields(
          { name: underline("User"), value: `<@${interaction.user.id}>`, inline: true },
          { name: underline("Status"), value: "Infected", inline: true },
          { name: underline("Disease"), value: disease.name },
          { name: underline("Next Step"), value: `${nextStepInstruction}\n\nFollow your dinosaur's disease section carefully.` }
        )
        .setThumbnail(variantThumbnails[diseaseKey])
        .setFooter({ text: "Xiled Project Realism • Disease System" });

      return interaction.reply({ embeds: [embed] });
    }

    // -------------------
    // OUTCOME COMMAND
    // -------------------
    if (sub === "outcome") {
      const data = loadData();
      const userData = data[interaction.user.id];

      if (!userData) {
        return interaction.reply({
          content: "You have no active infections.",
          ephemeral: true
        });
      }

      const diseaseKey = userData.disease;
      const disease = diseases[diseaseKey];

      let outcome;
      let color;
      let nextStep;

      if (diseaseKey === "HRV2") {
        const survived = Math.random() < 0.7;
        outcome = survived ? "Recovered" : "Succumbed to infection";
        color = survived ? 0x57F287 : 0xED4245;
        nextStep = survived
          ? "Type **!recovered** in local chat to recover from infection."
          : "Type **!fatal** in local chat to put your dinosaur to rest.";
      } else {
        outcome = "Fatal";
        color = 0xED4245;
        nextStep = "Type **!fatal** in local chat to put your dinosaur to rest.";
      }

      // Remove infection
      delete data[interaction.user.id];
      saveData(data);

      const embed = new EmbedBuilder()
        .setTitle("☣️ INFECTION OUTCOME")
        .setColor(color)
        .setDescription(`Your infection outcome for **${disease.name}** has been determined.\n\n`)
        .addFields(
          { name: underline("User"), value: `<@${interaction.user.id}>`, inline: true },
          { name: underline("Final Result"), value: outcome, inline: true },
          { name: underline("Next Step"), value: `${nextStep}\n\nRemember that your dinosaur's story does not end here.` }
        )
        .setThumbnail(variantThumbnails[diseaseKey])
        .setFooter({ text: "Xiled Project Realism • Disease System" });

      return interaction.reply({ embeds: [embed] });
    }
  }
});

client.login(process.env.TOKEN);