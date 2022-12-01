// Credits BelethLucifer(Mika#5285), Valatos and TheStrikes.
// Last update: 28/10/2022 Command works fine, could use something to catch rate limit errors.

/// Pre-command requirements
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const noblox = require('noblox.js');
const { GuildId, clientId, is_police_id, academy_id, TRELLO_LIST_ID_SCREENING, HC_ROLE_ID_POLICE, TRELLO_LIST_ID_POLICE, TRELLO_USER_KEY, TRELLO_USER_TOKEN } = require('../config.json');
const trello = require('../trello.js');
const util = require('../util.js');

///Command creator section
module.exports = {
  data: new SlashCommandBuilder()
    .setName('requestscreening')
    .setDescription('Requests screening for a ROBLOX user.')
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
    const noblox_thumbnail = await noblox.getPlayerThumbnail(noblox_userid, 420, "png", true, "Bust");
    const noblox_info = await noblox.getPlayerInfo(noblox_userid);
    const noblox_nld = await noblox.getRankNameInGroup(2525269, noblox_userid);
    const noblox_ant = await noblox.getRankNameInGroup(5024778, noblox_userid);
    const noblox_requester_idn = await noblox.getIdFromUsername(interaction.member.displayName);
    const noblox_requester_id = await noblox_requester_idn.toString();
    const noblox_requester_thumb = await noblox.getPlayerThumbnail(noblox_requester_id, 420, "png", true, "Bust");
    const is_police = interaction.member.roles.cache.has(is_police_id);
    const is_academy = interaction.member.roles.cache.has(academy_id)
    const roblox_username = await JSON.stringify(noblox_username).replace(/"/g, '');
    const username_exists = await util.get_username_if_exists(username);

    /// Create new card
    if (username_exists) {
      let response = null;

      if (is_police || is_academy) {
        const description_obj = {
          "username": username,
          "noblox_userid_num": noblox_userid_num,
          "noblox_userid": noblox_userid,
          "noblox_username": noblox_username,
          "noblox_thumbnail": noblox_thumbnail,
          "noblox_info": noblox_info,
          "noblox_nld": noblox_nld,
          "noblox_ant": noblox_ant,
          "noblox_requester_idn": noblox_requester_idn,
          "noblox_requester_id": noblox_requester_id,
          "noblox_requester_thumb": noblox_requester_thumb
        };
        const description = JSON.stringify(description_obj);

        if (is_police || is_academy) {
          response = await trello.create_card(TRELLO_LIST_ID_SCREENING, {
            name: roblox_username,
            desc: description
          }, TRELLO_USER_KEY, TRELLO_USER_TOKEN);
          /// EMBEDS SECTION -- NEW CARD
          const NewScreeningEmbed = new EmbedBuilder()
            .setTitle(JSON.stringify(noblox_username).replace(/"/g, ''))
            .setThumbnail(noblox_thumbnail[0].imageUrl)
            .setDescription("ID:" + noblox_userid)
            .addFields({ name: "Join date", value: JSON.stringify(noblox_info.joinDate) })
            .addFields({ name: "Account age", value: JSON.stringify(noblox_info.age) + " days old", inline: true })
            .addFields({ name: "Friend count", value: JSON.stringify(noblox_info.friendCount), inline: true })
            .addFields({ name: "Roblox Banned", value: JSON.stringify(noblox_info.isBanned), inline: true })
            .addFields({ name: "NLD Group rank", value: noblox_nld })
            .addFields({ name: "ANT Group rank", value: noblox_ant })
            .addFields({ name: "Screening Status", value: "Awaiting Screening" })
            .setTimestamp()
            .setFooter({ text: "Screening requested by " + interaction.member.displayName, iconURL: noblox_requester_thumb[0].imageUrl });
          /// REPLY SECTION
          interaction.channel.send({ content: "New screening requested!", embeds: [NewScreeningEmbed], ephemeral: true });
        } else {
          interaction.reply("This command is only for Academy staff and the High Command. If you believe this is an error, please contact BelethLucifer.");
          return;
        }
      }
    } else {
      interaction.reply("This user doesn't exist! Make sure you spelled the name correctly!");
      return;
    }
  }
};
