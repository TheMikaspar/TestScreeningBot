const { Client, Collection, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { bot_token } = require('./config.json');
const noblox = require('noblox.js');
const fs = require('node:fs');
const path = require('node:path');
///const util = require('./util.js')

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
///util.init(this.client);

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
const eventsPath = path.join(__dirname, 'events');
const eventsFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}

for (const file of eventsFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}


client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;
  console.log(`${interaction.user.tag} in #${interaction.channel.name} pressed a button."`);
});

client.login(bot_token);
