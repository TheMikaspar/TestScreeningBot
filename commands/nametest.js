const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nametest')
    .setDescription('get user display name test'),

  /// Command send
  async execute(interaction) {
    const nickname = interaction.member.nickname;
    const date = Date.now();
    await interaction.reply({ content: `${date} -- Hello ${nickname}!`, ephemeral: true });
  }
};

