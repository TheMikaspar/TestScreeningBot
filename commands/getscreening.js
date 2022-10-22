/// Pre-command requirements
const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType } = require('discord.js');
const noblox = require('noblox.js')
const { GuildId, clientId, is_police_id, TRELLO_LIST_ID_SCREENING, HC_ROLE_ID_POLICE, TRELLO_LIST_ID_POLICE, TRELLO_USER_KEY, TRELLO_USER_TOKEN } = require('../config.json');
const trello = require('../trello.js')

///Command creator section
module.exports = {
  data: new SlashCommandBuilder()
        .setName('getscreening')
        .setDescription('Pulls all pending screening requests from Trello'),

/// Command send
          async execute(interaction) {

            let police_hc = await interaction.member.roles.cache.has(HC_ROLE_ID_POLICE);

            let all_cards;

            if (police_hc) {
                all_cards = await trello.get_cards(
                        TRELLO_LIST_ID_SCREENING,
                        TRELLO_USER_KEY,
                        TRELLO_USER_TOKEN
                );

  } all_cards.forEach(data => JSON.parse(data))
  console.log(data)
}
};
