/// Pre-command requirements
const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType } = require('discord.js');
const noblox = require('noblox.js')

///Command creator section
module.exports = {
  data: new SlashCommandBuilder()
        .setName('screen')
        .setDescription('Requests screening for provided user array')
        .addStringOption(option =>
          option.setName('username')
          .setDescription('ROBLOX username')
          .setRequired(true)),

/// Command send
          async execute(interaction) {

/// Noblox data section
            const username = await interaction.options.getString('username');
            const noblox_userid_num = await noblox.getIdFromUsername(username);
            const noblox_userid = await noblox_userid_num.toString();
            const noblox_username = await noblox.getUsernameFromId(noblox_userid);
            const noblox_thumbnail = await noblox.getPlayerThumbnail(noblox_userid, 420 ,"png", true, "Bust");
            const noblox_info = await noblox.getPlayerInfo(noblox_userid);

/// Button create section
            const row = new ActionRowBuilder()
                .addComponents(
                  new ButtonBuilder()
                      .setCustomId('success')
                      .setLabel('Accept')
                      .setStyle(ButtonStyle.Success),
                  new ButtonBuilder()
                      .setCustomId('danger')
                      .setLabel('Decline')
                      .setStyle(ButtonStyle.Danger),
                  new ButtonBuilder()
                      .setLabel('Roblox link')
                      .setURL('https://roblox.com/users/' + noblox_userid + '/profile')
                      .setStyle(ButtonStyle.Link)

                );

/// Embed creation section
            const NewScreeningEmbed = new EmbedBuilder()
            .setTitle(JSON.stringify(noblox_username).replace(/"/g, ''))
            .setThumbnail(noblox_thumbnail[0].imageUrl)
            .setDescription("ID:" + noblox_userid)
            .addFields({name: "Join date", value: JSON.stringify(noblox_info.joinDate)})
            .addFields({name: "Account age", value: JSON.stringify(noblox_info.age)})
            .addFields({name: "Friend count", value: JSON.stringify(noblox_info.friendCount)})
            .addFields({name: "Banned", value: JSON.stringify(noblox_info.isBanned)})
            .addFields({name: "Screening Status", value: "Awaiting Screening"})
            .setTimestamp();

            const PassedScreeningEmbed = new EmbedBuilder()
            .setTitle(JSON.stringify(noblox_username).replace(/"/g, ''))
            .setThumbnail(noblox_thumbnail[0].imageUrl)
            .setDescription("ID:" + noblox_userid)
            .addFields({name: "Join date", value: JSON.stringify(noblox_info.joinDate)})
            .addFields({name: "Account age", value: JSON.stringify(noblox_info.age)})
            .addFields({name: "Friend count", value: JSON.stringify(noblox_info.friendCount)})
            .addFields({name: "Banned", value: JSON.stringify(noblox_info.isBanned)})
            .addFields({name: "Screening Status", value: "Passed :white_check_mark:"})
            .setTimestamp();

            const FailedScreeningEmbed = new EmbedBuilder()
            .setTitle(JSON.stringify(noblox_username).replace(/"/g, ''))
            .setThumbnail(noblox_thumbnail[0].imageUrl)
            .setDescription("ID:" + noblox_userid)
            .addFields({name: "Join date", value: JSON.stringify(noblox_info.joinDate)})
            .addFields({name: "Account age", value: JSON.stringify(noblox_info.age)})
            .addFields({name: "Friend count", value: JSON.stringify(noblox_info.friendCount)})
            .addFields({name: "Banned", value: JSON.stringify(noblox_info.isBanned)})
            .addFields({name: "Screening Status", value: "Failed :x:"})
            .setTimestamp();

/// Button reply section
const message = await interaction.reply({ embeds: [ NewScreeningEmbed ] , components: [row]});
const filter = (i) => {
  if (interaction.used.id != i.user.id) {
      i.reply({content: `Get balled lol https://cdn.discordapp.com/attachments/307592516184702977/1028000843527626883/unknown.png`, ephemeral: true});
        return false
  } else return true
}
const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button })

collector.on('collect', i => {
  if (i.customId === 'success' && i.user.id === '243030109492215809') {
     i.update({content: 'Screening accepted!', embeds: [PassedScreeningEmbed], components: [] });
  } if (i.customId === 'danger' && i.user.id === '243030109492215809') {
     i.update({content: 'Screening denied!', embeds: [FailedScreeningEmbed], components: [] });
  }
});



/// Console logs

          }
    };
