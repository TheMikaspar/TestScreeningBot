const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');



module.exports = {
  data: new SlashCommandBuilder()
        .setName('bal')
        .setDescription('Ballin?'),
      async execute(interaction) {
        const file = new AttachmentBuilder('https://cdn.discordapp.com/attachments/307592516184702977/1028000843527626883/unknown.png');
const ballinEmbed = new EmbedBuilder()
  .setTitle('Get balled loser')
  .setDescription(`I, ${interaction.user.tag} am in love with Molag Bal`)
  .addFields({name: "Would fuck?", value: "Yes!!! :heart:"})
  .setImage('attachment://unknown.png');

        await interaction.reply({ embeds: [ballinEmbed], files: [file] });

      },
};
