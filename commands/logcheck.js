// Credits BelethLucifer(Mika#5285), Valatos and TheStrikes.
// Last update: 28/10/2022 Command works fine, ready for deployment!

/// Pre-command requirements
const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType } = require('discord.js');
const noblox = require('noblox.js')
const { GuildId, clientId, is_police_id, knp_group, IS_AIVD, TRELLO_LIST_ID_SCREENING, HC_ROLE_ID_POLICE, TRELLO_LIST_ID_POLICE, TRELLO_USER_KEY, TRELLO_USER_TOKEN } = require('../config.json');
const trello = require('../trello.js')

///Command creator section
module.exports = {
  data: new SlashCommandBuilder()
        .setName('logcheck')
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
/// Get group members for set roles
  const rolesetIds = [22363330, 22363329, 22363327, 22363321, 22363313];
  const all_members = await noblox.getPlayers(knp_group, rolesetIds);

  let logMessage = "";
  let counter = 0;
  
  for (const user of all_members) {
      const username = user.username;
  
      if (!all_cards.includes(username)) {
          counter++;
  
          // Every 10th message
          if (counter % 10 == 0) {
              interaction.user.send(logMessage);
              logMessage = "";
          } else {
              logMessage += "**" + username + "** **did not log any patrols since the last check.**\n";
          }
      }
  }
  
  // there is still a message inside the buffer that wasn't sent yet.
  // This could because the amount of people not logging is not divisible by 10. i.e: 5 people logging
  // Send the message anyway.
  if (logMessage.length > 0) {
      interaction.user.send(logMessage);
  };
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
/// Check if hours > minimums and if user has logged anything

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
      interaction.client.users.fetch(m).then(m => m.send("You did not reach the minimum patrol hours required. If this has occurred more often, the High Command will be in contact. Please keep in mind that any leave of absence has not been taken into consideration. ").catch(() => {}))};
      interaction.user.send("**" + name + "** did not reach the *minimum patrol* time since the last check.")
            }
        } 
      } else {
        interaction.reply({content: "Only the High Command may view all logs. If you believe this is an error, please contact BelethLucifer.", ephemeral: true});
    } 
  }
};
