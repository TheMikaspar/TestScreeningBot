const { REST, Routes } = require('discord.js');
const { clientId, guildId, bot_token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(bot_token);

/// To delete commands
///rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
///.then(() => console.log('Successfully deleted all guild commands.'))
///.catch(console.error);

/// To load new commands
rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
  .then((data) => console.log(`Successfully registered ${data.length} application commands.`))
  .catch(console.error);
