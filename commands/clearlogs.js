// Credits BelethLucifer(Mika#5285), Valatos and TheStrikes.
// Last update: 28/10/2022 Command works fine, ready for deployment.

const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType, } = require('discord.js');
const noblox = require('noblox.js');
const trello = require('../trello.js');
const { GuildId, clientId, is_police_id, HC_ROLE_ID_POLICE, TRELLO_BOARD_ID, TRELLO_LIST_ID_OLD, TRELLO_LIST_ID_POLICE, TRELLO_USER_KEY, TRELLO_USER_TOKEN, board_id, new_list_id, list_id } = require('../config.json');
const util = require('../util.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clearlogs')
    .setDescription('Clear all logs'),

  async execute(interaction) {
    let list_id = TRELLO_LIST_ID_POLICE;

    const cards = await trello.get_cards(list_id, TRELLO_USER_KEY, TRELLO_USER_TOKEN);

    const is_police = interaction.member.roles.cache.has(is_police_id);
    let police_hc = await interaction.member.roles.cache.has(HC_ROLE_ID_POLICE);
    let response = null;
    let date_ob = new Date();
    let day = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    /// Create new card
    const description = `Logs last cleared on ${day}-${month}-${year} at ${hours}:${minutes}. Contained the following items: ${JSON.stringify(cards)}`;
    const title = `Last log clear: ${day}-${month}-${year}`

    if (police_hc) {
      response = await trello.create_card(TRELLO_LIST_ID_POLICE, {
        name: title,
        desc: description
      }, TRELLO_USER_KEY, TRELLO_USER_TOKEN);

      trello.move_card(TRELLO_LIST_ID_POLICE, TRELLO_BOARD_ID, TRELLO_LIST_ID_OLD, TRELLO_USER_KEY, TRELLO_USER_TOKEN);
      interaction.reply("All logs moved to archive.");
    } else {
      interaction.reply({ content: "You can't use this command! This is for the High Command only!", ephemeral: true });
    }
    ///    if (cards) {
    ///            await trello.move_card(list_id, new_list_id, board_id, TRELLO_USER_KEY, TRELLO_USER_TOKEN);
    ///        } return;


  }
};
