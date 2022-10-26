/// Pre-command requirements
const { SlashCommandBuilder, EmbedBuilder,  } = require('discord.js');
const { wearAssetId } = require('noblox.js');
const { BOT_OWNER_ID } = require('../config.json');

///Command creator section
module.exports = {
  data: new SlashCommandBuilder()
        .setName('shutdown')
        .setDescription('Shutdown bot'),

/// Command send
          async execute(interaction) {
            if(BOT_OWNER_ID) {
                interaction.channel.send("Bot shutting down in 1 second!");
                const m = interaction.guild.members.cache.find(member => member.nickname == "BelethLucifer");
    if(m) {
      interaction.client.users.fetch(m).then(m => m.send(`${interaction.user.tag} has shut down the Police Assistant Bot.`).catch(() => {}))};
                
                setTimeout(() => { interaction.client.destroy(); }, 1000);
                
            } else {
                interaction.channel.send("You're not allowed to run this command!");
                const m = interaction.guild.members.cache.find(member => member.nickname == "BelethLucifer");
    if(m) {
      interaction.client.users.fetch(m).then(m => m.send(`${interaction.user.tag} tried to run /shutdown but failed.`).catch(() => {}))};
            }
        }
    };