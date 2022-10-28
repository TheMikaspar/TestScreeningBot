// Credits BelethLucifer(Mika#5285), Valatos and TheStrikes.
// Last update: 28/10/2022 Command works fine, ready for deployment.

const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType, } = require('discord.js');
const noblox = require('noblox.js');
const trello = require('../trello.js');
const { GuildId, clientId, is_police_id, IS_AIVD, HC_ROLE_ID_POLICE, TRELLO_BOARD_ID, TRELLO_LIST_ID_SCREENING_OLD, TRELLO_LIST_ID_SCREENING, TRELLO_USER_KEY, TRELLO_USER_TOKEN, board_id, new_list_id, list_id } = require('../config.json');
const util = require('../util.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clearscreening')
    .setDescription('Clear all screenings'),

async execute(interaction) {

    const is_aivd = interaction.member.roles.cache.has(IS_AIVD);

        if (is_aivd) {

        trello.move_card(TRELLO_LIST_ID_SCREENING, TRELLO_BOARD_ID, TRELLO_LIST_ID_SCREENING_OLD, TRELLO_USER_KEY, TRELLO_USER_TOKEN);
                   interaction.reply("All screenings moved to archive.");
            } else {
              interaction.reply({content: "You can't use this command! This is for the High Command only!", ephemeral: true});
              return;
            }
///    if (cards) {
///            await trello.move_card(list_id, new_list_id, board_id, TRELLO_USER_KEY, TRELLO_USER_TOKEN);
///        } return;


  }
};
