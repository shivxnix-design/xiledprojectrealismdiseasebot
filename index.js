require("dotenv").config();
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const diseases = require("./diseases");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// Thumbnails
const variantThumbnails = {
  HRV2: "https://cdn.discordapp.com/attachments/1475249130283729100/1484910605436719224/Server_Edits-12_1.png?ex=69bff244&is=69bea0c4&hm=b2f3545c976e587f89181ac8b1e340d5da6d500f3481ed3817c2be16fbe6de08&",
  HRV_DELTA: "https://cdn.discordapp.com/attachments/1475249130283729100/1484910569734799360/Server_Edits-12.png?ex=69bff23c&is=69bea0bc&hm=54f2d5005240593f1aa1d0b3fae8324841d2771e59bd3192279ce651f0894a53&",
  SAURO_OSTEO: "https://cdn.discordapp.com/attachments/1475249130283729100/1485075127619031111/content.png?ex=69c08b7d&is=69bf39fd&hm=118139ed21304ca6652157be0e13ac7e7f905308dc6e1affb6c0ac92b1b504ae&"
};

// In-memory tracking for active infections/diseases
const activeDiseases = {};   // userId -> diseaseKey
const activeInfections = {}; // userId -> infectionKey

// Helper to underline text
function underline(text) {
  return text.split("").map(c => c + "\u0332").join("");
}

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  // -------------------
  // DISEASE COMMAND
  // -------------------
  if (interaction.commandName === "disease") {
    const sub = interaction.options.getSubcommand();

    if (sub === "expose") {
      const attacker = interaction.options.getString("attacker");
      const attackerName = attacker === "meg" ? "Megalania" : "Metricanthosaurus";

      if (activeDiseases[interaction.user.id]) {
        return interaction.reply({
          content: "You already have an active infection. Use `/disease outcome` first.",
          ephemeral: true
        });
      }

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

      const diseaseKey = Math.random() < 0.7 ? "HRV2" : "HRV_DELTA";
      const disease = diseases[diseaseKey];

      activeDiseases[interaction.user.id] = diseaseKey;

      const nextStepInstruction = diseaseKey === "HRV2"
        ? "Roleplay symptoms based on your dinosaur's profile, and apply the disease by typing **!hrv2** in local chat in-game."
        : "Roleplay symptoms based on your dinosaur's profile, and apply the disease by typing **!hrvdelta** in local chat in-game.";

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

    if (sub === "outcome") {
      const diseaseKey = activeDiseases[interaction.user.id];
      if (!diseaseKey) {
        return interaction.reply({
          content: "You have no active disease. Use `/disease expose` first.",
          ephemeral: true
        });
      }

      const disease = diseases[diseaseKey];

      let outcome;
      let color;
      let nextStep;

      if (diseaseKey === "HRV2") {
        const survived = Math.random() < 0.7;
        outcome = survived ? "Recovered" : "Succumbed to infection";
        color = survived ? 0x57F287 : 0xED4245;
        nextStep = survived
          ? "Type **!recover** in local chat to recover from infection."
          : "Type **!fatal** in local chat to put your dinosaur to rest.";
      } else if (diseaseKey === "HRV_DELTA") {
        outcome = "Succumbed to infection";
        color = 0xED4245;
        nextStep = "Type **!fatal** in local chat to put your dinosaur to rest.";
      }

      delete activeDiseases[interaction.user.id];

      const embed = new EmbedBuilder()
        .setTitle("☣️ INFECTION OUTCOME")
        .setColor(color)
        .setDescription(`Your infection outcome for **${disease.name}** has been determined.`)
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

  // -------------------
  // INFECTION COMMAND (Sauropod Osteomyelitis)
  // -------------------
  if (interaction.commandName === "infection") {
    const sub = interaction.options.getSubcommand();
    const disease = diseases.SAURO_OSTEO;

    if (sub === "apply") {
      if (activeInfections[interaction.user.id]) {
        return interaction.reply({
          content: "You already have an active bone infection. Use `/infection outcome` first.",
          ephemeral: true
        });
      }

      const infected = Math.random() < 0.85;
      if (!infected) return interaction.reply({ content: "Your injuries did not result in infection." });

      activeInfections[interaction.user.id] = "SAURO_OSTEO";

      const embed = new EmbedBuilder()
        .setTitle("⚠️ BONE INFECTION DEVELOPED")
        .setColor(0xE6B800)
        .setThumbnail(variantThumbnails["SAURO_OSTEO"])
        .setDescription("A **bone infection** has developed following severe trauma.")
        .addFields(
          { name: underline("User"), value: `<@${interaction.user.id}>`, inline: true },
          { name: underline("Condition"), value: disease.name },
          { name: underline("Next Step"), value: "Type **!osteo** in local chat and roleplay behavior." }
        )
        .setFooter({ text: "Xiled Project Realism • Infection System" });

      return interaction.reply({ embeds: [embed] });
    }

    if (sub === "outcome") {
      if (!activeInfections[interaction.user.id]) {
        return interaction.reply({
          content: "You have no active bone infection. Use `/infection apply` first.",
          ephemeral: true
        });
      }

      const survived = Math.random() < 0.8;
      const outcome = survived ? "Stabilized" : "Fatal Complications";
      const color = survived ? 0x57F287 : 0xED4245;
      const nextStep = survived ? "Continue roleplaying long-term injury." : "Type **!fatal** in local chat.";

      delete activeInfections[interaction.user.id];

      const embed = new EmbedBuilder()
        .setTitle("☣️ INFECTION OUTCOME")
        .setColor(color)
        .setThumbnail(variantThumbnails["SAURO_OSTEO"])
        .addFields(
          { name: underline("User"), value: `<@${interaction.user.id}>`, inline: true },
          { name: underline("Result"), value: outcome, inline: true },
          { name: underline("Next Step"), value: nextStep }
        )
        .setFooter({ text: "Xiled Project Realism • Infection System" });

      return interaction.reply({ embeds: [embed] });
    }
  }
});

client.login(process.env.TOKEN);