const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');

const file = new AttachmentBuilder('https://cdn.discordapp.com/attachments/307592516184702977/1028000843527626883/unknown.png');
const ballinEmbed = new EmbedBuilder()
  .setTitle('Get balled loser')
  .setImage('attachment://unknown.png');


module.exports = {
  data: new SlashCommandBuilder()
        .setName('bal')
        .setDescription('Ballin?'),
      async execute(interaction) {
        await interaction.reply({ embeds: [ballinEmbed], files: [file] });

      },
};
