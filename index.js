require("dotenv").config();
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const diseases = require("./diseases");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

function underline(text) {
  return text.split("").map(c => c + "\u0332").join("");
}

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  // =========================
  // DISEASE COMMAND (existing system)
  // =========================
  if (interaction.commandName === "disease") {
    const sub = interaction.options.getSubcommand();

    if (sub === "expose") {
      const attacker = interaction.options.getString("attacker");
      const attackerName = attacker === "meg" ? "Megalania" : "Metricanthosaurus";

      const infected = Math.random() < 0.9;

      if (!infected) {
        return interaction.reply({
          content: `You survived an encounter with ${attackerName}, and no infection developed.`
        });
      }

      const diseaseKey = Math.random() < 0.7 ? "HRV2" : "HRV_DELTA";
      const disease = diseases[diseaseKey];

      const nextStep = diseaseKey === "HRV2"
        ? "Type **!hrv2** in local chat and roleplaying symptoms."
        : "Type **!hrvdelta** in local chat and roleplaying symptoms.";

      const embed = new EmbedBuilder()
        .setTitle("⚠️ INFECTION CONTRACTED")
        .setColor(0xE6B800)
        .setDescription(`You have been infected by a **${attackerName}**.`)
        .addFields(
          { name: underline("User"), value: `<@${interaction.user.id}>`, inline: true },
          { name: underline("Disease"), value: disease.name },
          { name: underline("Next Step"), value: nextStep }
        )
        .setFooter({ text: "Xiled Project Realism • Disease System" });

      return interaction.reply({ embeds: [embed] });
    }

    if (sub === "outcome") {
      // Keep your old disease outcome logic if needed
      return interaction.reply({ content: "Disease outcome logic here." });
    }
  }

  // =========================
  // INFECTION COMMAND (sauropod bone infection ONLY)
  // =========================
  if (interaction.commandName === "infection") {
    const sub = interaction.options.getSubcommand();
    const disease = diseases.SAURO_OSTEO;

    if (sub === "apply") {
      const infected = Math.random() < 0.85;

      if (!infected) {
        return interaction.reply({
          content: "Your injuries did not result in infection."
        });
      }

      const embed = new EmbedBuilder()
        .setTitle("⚠️ BONE INFECTION DEVELOPED")
        .setColor(0xE6B800)
        .setDescription("A **bone infection** has developed following severe trauma.")
        .addFields(
          { name: underline("User"), value: `<@${interaction.user.id}>`, inline: true },
          { name: underline("Condition"), value: disease.name },
          { name: underline("Next Step"), value: "Type **!osteo** in local chat and roleplay symtoms." }
        )
        .setFooter({ text: "Xiled Project Realism • Infection System" });

      return interaction.reply({ embeds: [embed] });
    }

    if (sub === "outcome") {
      const survived = Math.random() < 0.8;

      const outcome = survived ? "Stabilized" : "Fatal Complications";
      const color = survived ? 0x57F287 : 0xED4245;

      const nextStep = survived
        ? "Continue roleplaying long-term injury."
        : "Type **!fatal** in local chat.";

      const embed = new EmbedBuilder()
        .setTitle("☣️ INFECTION OUTCOME")
        .setColor(color)
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