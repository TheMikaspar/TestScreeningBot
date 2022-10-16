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
        const noblox_info = await noblox.getPlayerInfo(noblox_userid);
      ///  const imageFile = new AttachmentBuilder(noblox_thumbnail[0].imageUrl);
        const RobloxUserEmbed = new EmbedBuilder()
            .setTitle(username)
          ///  .setSubtitle(noblox_info[0].displayName)
            .setThumbnail(noblox_thumbnail[0].imageUrl)
            .setDescription(noblox_userid)
          ///  .addFields({name: "info", value: JSON.stringify(noblox_info)})
            .addFields({name: "Join date", value: JSON.stringify(noblox_info.joinDate)})
            .addFields({name: "Account age", value: JSON.stringify(noblox_info.age)})
            .addFields({name: "Friend count", value: JSON.stringify(noblox_info.friendCount)})
            .addFields({name: "Banned", value: JSON.stringify(noblox_info.isBanned)})
            .setTimestamp();
    ///  await interaction.reply({ embeds: [RobloxUserEmbed] });
    await interaction.reply({ embeds: [ RobloxUserEmbed ]});
      ///    await interaction.reply({content: noblox_info})
      console.log(noblox_thumbnail[0].imageUrl);
      console.log(noblox_info);
      console.log(noblox_thumbnail);
      }
};
