/// Pre-command requirements
const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType } = require('discord.js');
const noblox = require('noblox.js')
const { GuildId, clientId, is_police_id, IS_AIVD, TRELLO_LIST_ID_SCREENING, HC_ROLE_ID_POLICE, TRELLO_LIST_ID_POLICE, TRELLO_USER_KEY, TRELLO_USER_TOKEN } = require('../config.json');
const trello = require('../trello.js')

///Command creator section
module.exports = {
  data: new SlashCommandBuilder()
        .setName('getscreening')
        .setDescription('Pulls all pending screening requests from Trello'),

/// Command send
          async execute(interaction) {

            let is_aivd = await interaction.member.roles.cache.has(IS_AIVD);

            let all_cards;

            if (is_aivd) {
                all_cards = await trello.get_cards(
                        TRELLO_LIST_ID_SCREENING,
                        TRELLO_USER_KEY,
                        TRELLO_USER_TOKEN
                );
/// Get data from cards
   for (const card of all_cards) {
    const data = card.desc;
    const data_parsed = JSON.parse(data);
    const username = await data_parsed.username;
    const noblox_userid_num = data_parsed.noblox_userid_num;
    const noblox_userid = data_parsed.noblox_userid;
    const noblox_username = data_parsed.noblox_username;
    const noblox_thumbnail = data_parsed.noblox_thumbnail;
    const noblox_info = data_parsed.noblox_info;
    const noblox_nld = data_parsed.noblox_nld;
    const noblox_ant = data_parsed.noblox_ant;
    const noblox_requester_idn = data_parsed.noblox_requester_idn;
    const noblox_requester_id = data_parsed.noblox_requester_id;
    const noblox_requester_thumb = data_parsed.noblox_requester_thumb;

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

/// Create embeds for each card
    const NewScreeningEmbed = new EmbedBuilder()
    .setTitle(noblox_username)
    .setThumbnail(noblox_thumbnail[0].imageUrl)
    .setDescription("ID:" + noblox_userid)
    .addFields({name: "Join date", value: JSON.stringify(noblox_info.joinDate)})
    .addFields({name: "Account age", value: JSON.stringify(noblox_info.age) + " days old", inline: true})
    .addFields({name: "Friend count", value: JSON.stringify(noblox_info.friendCount), inline: true})
    .addFields({name: "Roblox Banned", value: JSON.stringify(noblox_info.isBanned), inline: true})
    .addFields({name: "NLD Group rank", value: noblox_nld })
    .addFields({name: "ANT Group rank", value: noblox_ant})
    .addFields({name: "Screening Status", value: "Awaiting Screening"})
    .setTimestamp()
    .setFooter({text: "Screening requested by " + interaction.member.displayName, iconURL: noblox_requester_thumb[0].imageUrl});

    const PassedScreeningEmbed = new EmbedBuilder()
    .setTitle(noblox_username)
    .setThumbnail(noblox_thumbnail[0].imageUrl)
    .setDescription("ID:" + noblox_userid)
    .addFields({name: "Join date", value: JSON.stringify(noblox_info.joinDate)})
    .addFields({name: "Account age", value: JSON.stringify(noblox_info.age)})
    .addFields({name: "Friend count", value: JSON.stringify(noblox_info.friendCount)})
    .addFields({name: "Roblox Banned", value: JSON.stringify(noblox_info.isBanned)})
    .addFields({name: "Screening Status", value: "Passed :white_check_mark:"})
    .setTimestamp();

    const FailedScreeningEmbed = new EmbedBuilder()
    .setTitle(noblox_username)
    .setThumbnail(noblox_thumbnail[0].imageUrl)
    .setDescription("ID:" + noblox_userid)
    .addFields({name: "Join date", value: JSON.stringify(noblox_info.joinDate)})
    .addFields({name: "Account age", value: JSON.stringify(noblox_info.age)})
    .addFields({name: "Friend count", value: JSON.stringify(noblox_info.friendCount)})
    .addFields({name: "Roblox Banned", value: JSON.stringify(noblox_info.isBanned)})
    .addFields({name: "Screening Status", value: "Failed :x:"})
    .setTimestamp();

/// Button reply section
const message = await interaction.channel.send({ embeds: [ NewScreeningEmbed ] , components: [row]});
const filter = (i) => {
if (interaction.user.id !== i.user.id) {
i.reply({content: `This is not meant for you.`, ephemeral: true});
return false
} else return true
}
const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button })

collector.on('collect', i => {
if (i.customId === 'success' && i.user.id === '243030109492215809') {
i.update({content: 'Screening accepted!', embeds: [PassedScreeningEmbed], components: [] });
const m = interaction.guild.members.cache.find(member => member.nickname == username);
if(m) {
  interaction.client.users.fetch(m).then(m => m.send("Congratulations! You passed your screening and may now start requesting trainings. Good luck!").catch(() => {}))};
} if (i.customId === 'danger' && i.user.id === '243030109492215809') {
  const m = interaction.guild.members.cache.find(member => member.nickname == username);
  if(m) {
    interaction.client.users.fetch(m).then(m => m.send("Dear " + noblox_username + ", You have failed your screening. Please contact BelethLucifer for more information.").catch(() => {}))};
i.update({content: 'Screening denied!', embeds: [FailedScreeningEmbed], components: [] });
          }
        })
      }
    } else {
      interaction.reply("This command is only for our screening team. If you believe this is an error, please contact BelethLucifer.");
    }
  }
};
