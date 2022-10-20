/// Pre-command requirements
const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType } = require('discord.js');
const noblox = require('noblox.js');
const trello = require('../trello.js');
const { GuildId, clientId, is_police_id, HC_ROLE_ID_POLICE, TRELLO_LIST_ID_POLICE, TRELLO_USER_KEY, TRELLO_USER_TOKEN } = require('../config.json');
const util = require('../util.js');

///Command creator section
module.exports = {
  data: new SlashCommandBuilder()
        .setName('logpatrol')
        .setDescription('Logs your patrol')
        .addStringOption(option =>
          option.setName('username')
          .setDescription('ROBLOX username')
          .setRequired(true))
        .addNumberOption(option =>
          option.setName('hours')
          .setDescription('Hours patrolled')
          .setRequired(true))
        .addNumberOption(option =>
          option.setName('minutes')
          .setDescription('Minutes patrolled')
          .setRequired(true)),

  async execute(interaction) {
    const username = await interaction.options.getString('username');
    const hours = await interaction.options.getNumber('hours');
    const minutes = await interaction.options.getNumber('minutes');
    const hours_patrolled = await hours.toString();
    const minutes_patrolled = await minutes.toString();

    const roblox_userid = await noblox.getIdFromUsername(username);
    const roblox_username_orig = await noblox.getUsernameFromId(roblox_userid);
    const roblox_username = await JSON.stringify(roblox_username_orig).replace(/"/g, '');
    const is_police = interaction.member.roles.cache.has(is_police_id);

      // The user does not exist.
      if (!roblox_username) {
          interaction.reply({content: "That user does not exist! Are you sure you have entered the right name?", ephemeral: true });

          return;
      }

      // These three variables are here just to improve readability.

      if (Number.isNaN(hours_patrolled) || Number.isNaN(minutes_patrolled)) {
          interaction.reply({content: "Please, actually specify the hours and minutes in just numbers. First the hours, then the minutes!", ephemeral: true });

          return;
      }

      if (minutes_patrolled > 60 || minutes_patrolled < 0) {
          interaction.reply({content: "I'm sorry, but minutes only go up to and including sixty, and cannot be lower than zero!", ephemeral: true});

          return;
      }

      if (hours_patrolled < 0) {
          interaction.reply({content: "I'm sorry, but hours cannot go below zero!", ephemeral: true});

          return;
      }

      let existing_card;

      if (is_police) {
          existing_card = await trello.get_card_by_name(
                  TRELLO_LIST_ID_POLICE,
                  roblox_username,
                  TRELLO_USER_KEY,
                  TRELLO_USER_TOKEN
          );
      } else {
          interaction.reply({content: "You need to be a member of the Police to use this command!"})
      }

      let response = null;

      if (!existing_card) {
          const description = `Hours patrolled: ${hours_patrolled}\nMinutes patrolled: ${minutes_patrolled}`;

          if (is_police) {
              response = await trello.create_card(TRELLO_LIST_ID_POLICE, {
                  name: roblox_username,
                  desc: description
              }, TRELLO_USER_KEY, TRELLO_USER_TOKEN);
          } else {
              response = await trello.create_card(TRELLO_LIST_ID_AMBULANCE, {
                  name: roblox_username,
                  desc: description
              }, TRELLO_USER_KEY, TRELLO_USER_TOKEN);
          }
      } else {
          const old_description = existing_card.desc;

          // Parse the description so that we only get the hours patrolled in a number.
          const old_hours_patrolled   = parseInt(old_description.split("Hours patrolled: ")[1] // Remove the "Hours patrolled: " in front of the hours.
                                                                .split("\n"));                 // Also remove everything that comes on a new line.

          // Do the same to minutes as for hours.
          const old_minutes_patrolled = parseInt(old_description.split("Minutes patrolled: ")[1] // Remove the "Minutes patrolled: " in front of the minutes.
                                                                .split("\n"));                   // Also remove everything that comes on a new line.

          if (Number.isNaN(old_hours_patrolled) || Number.isNaN(old_minutes_patrolled)) {
              return;
          }

          // Because the values have been put there by us before, we can assume the numbers follow the right criteria.
          let new_hours_patrolled   = old_hours_patrolled   + hours_patrolled;
          let new_minutes_patrolled = old_minutes_patrolled + minutes_patrolled;

          if (new_minutes_patrolled >= 60) {
              new_hours_patrolled++;
              new_minutes_patrolled -= 60;
          }

          const description = `Hours patrolled: ${new_hours_patrolled}\nMinutes patrolled: ${new_minutes_patrolled}`;

          response = await trello.update_card(existing_card.id, {
              desc: description
          }, TRELLO_USER_KEY, TRELLO_USER_TOKEN);
      }

      if (response == null || (response.statusCode && response.statusCode == 429))
      {
        interaction.reply({content: "Error 429", ephemeral: true});
      } else {
interaction.reply({content: "I'm sorry, but something went wrong processing your patrol log. Please try again later, because we might have exceeded a ratelimit. If it keeps occuring, please message BelethLucifer.", ephemeral: true});
      }



  console.log(username + " patrolled for " + hours_patrolled + " hours and " + minutes_patrolled + " minutes. ");
  await interaction.reply({content: "You have added " + hours_patrolled + " hours and " + minutes_patrolled + " minutes to your patrol logs.", ephemeral: true})
}
};
