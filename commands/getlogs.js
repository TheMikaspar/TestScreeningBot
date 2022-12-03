// Credits BelethLucifer(Mika#5285), Valatos and TheStrikes.
// Last update: 03/12/2022 Removed unused variables, fixed formatting.

/// Pre-command requirements
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const noblox = require('noblox.js');
const { is_police_id, knp_group, TRELLO_LIST_ID_POLICE, TRELLO_USER_KEY, TRELLO_USER_TOKEN } = require('../config.json');
const trello = require('../trello.js');
const util = require('../util.js');

///Command creator section
module.exports = {
  data: new SlashCommandBuilder()
    .setName('getlogs')
    .setDescription('Retrieve logged patrols for a specific user.')
    .addStringOption(option =>
      option.setName('username')
        .setDescription('ROBLOX username.')
        .setRequired(true)),

  /// Command send
  async execute(interaction) {
    const opt_username = await interaction.options.getString('username');
    const roblox_username = await util.get_username_if_exists(opt_username);
    await interaction.deferReply({ ephemeral: true });

    if (roblox_username) {
      let is_police = await interaction.member.roles.cache.has(is_police_id);
      const noblox_userid_num = await noblox.getIdFromUsername(opt_username);
      const noblox_userid = await noblox_userid_num.toString();
      const noblox_username = await noblox.getUsernameFromId(noblox_userid);
      const noblox_thumbnail = await noblox.getPlayerThumbnail(noblox_userid, 420, "png", true, "Bust");
      const noblox_knp = await noblox.getRankNameInGroup(knp_group, noblox_userid);


      if (is_police) {
        all_cards = await trello.get_cards(
          TRELLO_LIST_ID_POLICE,
          TRELLO_USER_KEY,
          TRELLO_USER_TOKEN
        );

        const rolesetIds = [22363330, 22363329, 22363327, 22363321, 22363313];
        const all_members = await noblox.getPlayers(knp_group, rolesetIds);

        console.log(all_cards)
        console.log(all_members)


        for (const user of all_members) {
          const username = user.username;

          ///if (all_cards.includes(username)) {
          if (all_cards.some(({ name }) => name === noblox_username)) {

            user_card = await trello.get_card_by_name(
              TRELLO_LIST_ID_POLICE,
              noblox_username,
              TRELLO_USER_KEY,
              TRELLO_USER_TOKEN
            );
            console.log(user_card);
            const data = user_card.desc;

            const logged_hours = parseInt(data.split("Hours patrolled: ")[1].split("\n"));

            const logged_minutes = parseInt(data.split("Minutes patrolled: ")[1].split("\n"));


            if (Number.isNaN(logged_hours) || Number.isNaN(logged_minutes)) {
              return;
            }

            const LogEmbed = new EmbedBuilder()
              .setTitle(roblox_username)
              .setThumbnail(noblox_thumbnail[0].imageUrl)
              .setDescription("Patrol log found!")
              .addFields({ name: "Rank: ", value: noblox_knp })
              .addFields({ name: "Hours patrolled: ", value: logged_hours.toString(), inline: true })
              .addFields({ name: "Minutes patrolled: ", value: logged_minutes.toString(), inline: true })
              .setTimestamp();

            interaction.editReply({ embeds: [LogEmbed], ephemeral: true });
            return;
          } else {
            interaction.editReply({ content: "This user cannot be found in the logs! Make sure you spelled the name correctly!", ephemeral: true });
            return;
          }
        }
      } else {
        interaction.editReply({ content: "According to your roles, you are not a member of the Police. Please use your own log system or ensure you have the correct roles to run this command.", ephemeral: true });
        return;
      }
    } else {
      interaction.editReply({ content: "This user doesn't exist! Make sure you spelled the name correctly!", ephemeral: true });
      return;
    }
  }
};