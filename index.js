require("dotenv").config();
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const diseases = require("./diseases");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const DATA_PATH = "./data/infections.json";

function loadData() {
  return JSON.parse(fs.readFileSync(DATA_PATH));
}

function saveData(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

const variantThumbnails = {
  HRV2: "https://cdn.discordapp.com/attachments/1475249130283729100/1484910605436719224/Server_Edits-12_1.png",
  HRV_DELTA: "https://cdn.discordapp.com/attachments/1475249130283729100/1484910569734799360/Server_Edits-12.png"
};

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

    if (sub === "expose") {
      const data = loadData();

      if (data[interaction.user.id]) {
        return interaction.reply({
          content: "You already have an active condition. Use `/disease outcome` first.",
          ephemeral: true
        });
      }

      const attacker = interaction.options.getString("attacker");
      const dino = interaction.options.getString("dinosaur");

      const attackerName = attacker === "meg" ? "Megalania" : "Metricanthosaurus";

      const infected = Math.random() < 0.9;

      if (!infected) {
        const embed = new EmbedBuilder()
          .setTitle("🧬 EXPOSURE EVENT")
          .setColor(0x57F287)
          .setDescription(`You survived an encounter with **${attackerName}**, and no condition developed.`)
          .addFields(
            { name: underline("User"), value: `<@${interaction.user.id}>`, inline: true },
            { name: underline("Source"), value: attackerName, inline: true }
          )
          .setFooter({ text: "Xiled Project Realism • Disease System" });

        return interaction.reply({ embeds: [embed] });
      }

      let possibleDiseases = ["HRV2", "HRV_DELTA"];

      if (dino === "sauropod") {
        possibleDiseases.push("SAURO_OSTEO");
      }

      const diseaseKey = possibleDiseases[Math.floor(Math.random() * possibleDiseases.length)];
      const disease = diseases[diseaseKey];

      data[interaction.user.id] = { disease: diseaseKey };
      saveData(data);

      let exposureText;
      let nextStepInstruction;

      if (diseaseKey === "SAURO_OSTEO") {
        exposureText = "You have developed a **bone infection** following severe trauma.";
        nextStepInstruction = "Roleplay progressive bone damage and mobility issues and dont forget to type **!osteo** in local chat.";
      } else {
        exposureText = `You have been infected by a **${attackerName}**.`;
        nextStepInstruction = diseaseKey === "HRV2"
          ? "Roleplay symptoms based on your dinosaur's profile and dont forget to type  type **!hrv2** in local chat."
          : "Roleplay symptoms based on your dinosaur's profile and dont forget to type  type **!hrvdelta** in local chat.";
      }

      const embed = new EmbedBuilder()
        .setTitle("⚠️ CONDITION APPLIED")
        .setColor(0xE6B800)
        .setDescription(exposureText)
        .addFields(
          { name: underline("User"), value: `<@${interaction.user.id}>`, inline: true },
          { name: underline("Status"), value: "Condition Active", inline: true },
          { name: underline("Condition"), value: disease.name },
          { name: underline("Next Step"), value: `${nextStepInstruction}\n\nFollow your dinosaur's disease section carefully.` }
        )
        .setFooter({ text: "Xiled Project Realism • Disease System" });

      return interaction.reply({ embeds: [embed] });
    }

    if (sub === "outcome") {
      const data = loadData();
      const userData = data[interaction.user.id];

      if (!userData) {
        return interaction.reply({
          content: "You have no active conditions.",
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
          ? "Type **!recovered** in local chat to recover."
          : "Type **!fatal** in local chat to put your dinosaur to rest.";
      } else if (diseaseKey === "SAURO_OSTEO") {
        const survived = Math.random() < 0.8;
        outcome = survived ? "Condition Stabilized" : "Fatal Complications";
        color = survived ? 0x57F287 : 0xED4245;
        nextStep = survived
          ? "Continue roleplaying a long-term injury. Mobility should remain reduced."
          : "Type **!fatal** in local chat to put your dinosaur to rest.";
      } else {
        outcome = "Fatal";
        color = 0xED4245;
        nextStep = "Type **!fatal** in local chat to put your dinosaur to rest.";
      }

      delete data[interaction.user.id];
      saveData(data);

      const embed = new EmbedBuilder()
        .setTitle("☣️ CONDITION OUTCOME")
        .setColor(color)
        .setDescription(`The outcome of **${disease.name}** has been determined.\n\n`)
        .addFields(
          { name: underline("User"), value: `<@${interaction.user.id}>`, inline: true },
          { name: underline("Final Result"), value: outcome, inline: true },
          { name: underline("Next Step"), value: `${nextStep}\n\nRemember that your dinosaur's story continues.` }
        )
        .setFooter({ text: "Xiled Project Realism • Disease System" });

      return interaction.reply({ embeds: [embed] });
    }
  }
});

client.login(process.env.TOKEN);