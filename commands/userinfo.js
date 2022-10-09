const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const noblox = require('noblox.js')

module.exports = {
  data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Retrieves ROBLOX userinfo with provided username or userID')
        .addStringOption(option =>
          option.setName('username')
          .setDescription('ROBLOX username')
          .setRequired(true)),


      async execute(interaction) {

        const username = await interaction.options.getString('username');
        const noblox_userid_num = await noblox.getIdFromUsername(username);
        const noblox_userid = noblox_userid_num.toString();
        const noblox_thumbnail = await noblox.getPlayerThumbnail(noblox_userid, 420 ,"png", true, "Bust");
        const noblox_info_obj = await noblox.getPlayerInfo(noblox_userid);
        const noblox_info = JSON.stringify(noblox_info_obj);
        const RobloxUserEmbed = new EmbedBuilder()
            .setTitle(username)
            .setThumbnail(noblox_thumbnail.imageUrl)
            .setDescription(noblox_userid)
          ///  .addFields(
          ///    {name: "User information", value: noblox_info}
          ///  )
            .setTimestamp();
      await interaction.reply({ embeds: [RobloxUserEmbed] });
      ///    await interaction.reply({content: noblox_info})
      }
};
