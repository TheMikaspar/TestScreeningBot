const { SlashCommandBuilder } = require('discord.js');
const noblox = require('noblox.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  async execute(interaction) {
    const groupranks = await noblox.getRoles(3132608);
    console.log(groupranks);
    await interaction.reply('Pong!');

  },
};
