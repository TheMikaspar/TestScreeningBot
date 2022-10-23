/// Pre-command requirements
const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType } = require('discord.js');
const noblox = require('noblox.js')
const { GuildId, clientId, is_police_id, knp_group, IS_AIVD, TRELLO_LIST_ID_SCREENING, HC_ROLE_ID_POLICE, TRELLO_LIST_ID_POLICE, TRELLO_USER_KEY, TRELLO_USER_TOKEN } = require('../config.json');
const trello = require('../trello.js')

///Command creator section
module.exports = {
  data: new SlashCommandBuilder()
        .setName('getlogs')
        .setDescription('Pulls all patrol logs from Trello and checks if minimums have been reached.')
        .addNumberOption(option =>
          option.setName('minimum_hours')
          .setDescription('Minimum hours required since last check')
          .setRequired(true)),

/// Command send
          async execute(interaction) {

            let minimums = await interaction.options.getNumber('minimum_hours');
            let police_hc = await interaction.member.roles.cache.has(HC_ROLE_ID_POLICE);

            let all_cards;

            if (police_hc) {
                all_cards = await trello.get_cards(
                        TRELLO_LIST_ID_POLICE,
                        TRELLO_USER_KEY,
                        TRELLO_USER_TOKEN
                );
  const rolesetIds = [22363330, 22363329, 22363327, 22363321, 22363313]
  const all_members_array = noblox.getPlayers(knp_group, rolesetIds);
  console.log(all_members_array);
  console.log(minimums);
  console.log(minimums - 1);
/// Get data from cards
   for (const card of all_cards) {
    const data = card.desc;
    const name = card.name;
    const logged_hours = parseInt(data.split("Hours patrolled: ")[1]
                                      .split("\n"));

    const logged_minutes = parseInt(data.split("Minutes patrolled: ")[1]
                                        .split("\n"));

    if (Number.isNaN(logged_hours) || Number.isNaN(logged_minutes)) {
      return;
    }
/// Check if hours > minimums

if (logged_hours >= minimums) {

  const LogEmbed = new EmbedBuilder()
  .setTitle(name)
  .setDescription("Log check")
  .addFields({name: "Hours patrolled: ", value: logged_hours.toString(), inline: true })
  .addFields({name: "Minutes patrolled: ", value: logged_minutes.toString(), inline: true})
  .addFields({name: "Meets requirements: ", value: "Yes :white_check_mark:"})
  .setTimestamp();

const message = await interaction.channel.send({ embeds: [ LogEmbed ]});

} else if (logged_hours == minimums - 1 && logged_minutes >= 30) {
  const LogEmbed = new EmbedBuilder()
  .setTitle(name)
  .setDescription("Log check")
  .addFields({name: "Hours patrolled: ", value: logged_hours.toString(), inline: true })
  .addFields({name: "Minutes patrolled: ", value: logged_minutes.toString(), inline: true})
  .addFields({name: "Meets requirements: ", value: "Yes :white_check_mark:"})
  .setTimestamp();
  const message = await interaction.channel.send({ embeds: [ LogEmbed ]});
} else if (logged_hours < minimums) {
    const LogEmbed = new EmbedBuilder()
    .setTitle(name)
    .setDescription("Log check")
    .addFields({name: "Hours patrolled: ", value: logged_hours.toString(), inline: true })
    .addFields({name: "Minutes patrolled: ", value: logged_minutes.toString(), inline: true})
    .addFields({name: "Meets requirements: ", value: "No :x: "})
    .setTimestamp();
    const message = await interaction.channel.send({ embeds: [ LogEmbed ]});
    const m = interaction.guild.members.cache.find(member => member.nickname == name);
    if(m) {
      interaction.client.users.fetch(m).then(m => m.send("You did not reach the minimum patrol hours this month. If this has occurred more often, the High Command will be in contact. Please keep in mind that any leave of absence has not been taken into consideration. ").catch(() => {}))};
      interaction.user.send(name + " did not reach the minimum patrol time this month.")
}
      }
    }
  }
};
