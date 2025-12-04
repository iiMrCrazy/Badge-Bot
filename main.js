const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const { MongoClient } = require('mongodb');

// ---------------------------
// Bot setup
// ---------------------------
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const token = process.env.MTQxMzE4ODM5NTI2NTQyNTYwOA.GknLfn.5FxRBQ31MgxBUyioBcJfN5-YMw56WBrGsYjzXM;   // put your bot token in Environment Variable named DISCORD_TOKEN
const clientId = process.env.1413188395265425608;    // put your Client ID in Environment Variable named CLIENT_ID
// ---------------------------
// MongoDB connection
// ---------------------------
const uri = process.env.MONGO_URI;          // MongoDB URI from Railway Environment Variable
const mongoClient = new MongoClient(uri);
let db;

async function connectDB() {
  await mongoClient.connect();
  db = mongoClient.db("mybotdb"); // database name, you can change it
  console.log("✅ Connected to MongoDB");
}

connectDB();

// ---------------------------
// Language handling functions
// ---------------------------
async function getLanguage(guildId) {
  const guild = await db.collection("guilds").findOne({ guildId });
  return guild?.language || "en";
}

async function setLanguage(guildId, language) {
  await db.collection("guilds").updateOne(
    { guildId },
    { $set: { language } },
    { upsert: true } // add if not exist
  );
}

// ---------------------------
// Commands definition
// ---------------------------
const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),

  new SlashCommandBuilder()
    .setName('setlang')
    .setDescription('Set bot language (en/ar)')
    .addStringOption(option =>
      option.setName('language')
        .setDescription('Choose language: en or ar')
        .setRequired(true)
    ),
].map(command => command.toJSON());

// Register commands globally
const rest = new REST({ version: '10' }).setToken(token);
(async () => {
  try {
    await rest.put(Routes.applicationCommands(clientId), { body: commands });
    console.log('✅ Commands registered globally');
  } catch (error) {
    console.error(error);
  }
})();

// ---------------------------
// Bot ready
// ---------------------------
client.on('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// ---------------------------
// Commands handling
// ---------------------------
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const guildId = interaction.guildId;

  // ping command
  if (interaction.commandName === 'ping') {
    const lang = await getLanguage(guildId);
    if (lang === 'ar') {
      await interaction.reply('بونغ! 🏓');
    } else {
      await interaction.reply('Pong! 🏓');
    }
  }

  // setlang command
  if (interaction.commandName === 'setlang') {
    const chosenLang = interaction.options.getString('language').toLowerCase();
    if (chosenLang !== 'en' && chosenLang !== 'ar') {
      return interaction.reply('❌ Invalid language. Use `en` or `ar`.');
    }
    await setLanguage(guildId, chosenLang);
    if (chosenLang === 'ar') {
      await interaction.reply('✅ Language set to Arabic');
    } else {
      await interaction.reply('✅ Language set to English');
    }
  }
});

// ---------------------------
// Bot login
// ---------------------------
client.login(token);