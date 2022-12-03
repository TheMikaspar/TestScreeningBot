// Credits BelethLucifer(Mika#5285), Valatos and TheStrikes.
// Last update: 03/12/2022 Fixed formatting and removed unused code.

const { SlashCommandBuilder } = require('discord.js');
const trello = require('../trello.js');
const { IS_AIVD, TRELLO_BOARD_ID, TRELLO_LIST_ID_SCREENING_OLD, TRELLO_LIST_ID_SCREENING, TRELLO_USER_KEY, TRELLO_USER_TOKEN } = require('../config.json');

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
      interaction.reply({ content: "You can't use this command! This is for the High Command only!", ephemeral: true });
      return;
    }
  }
};
