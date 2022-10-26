/// Pre-command requirements
const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType } = require('discord.js');
const noblox = require('noblox.js');
const { GuildId, clientId, is_police_id, knp_group, IS_AIVD, TRELLO_LIST_ID_SCREENING, HC_ROLE_ID_POLICE, TRELLO_LIST_ID_POLICE, TRELLO_USER_KEY, TRELLO_USER_TOKEN } = require('../config.json');
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

    let is_police = await interaction.member.roles.cache.has(is_police_id);
    const opt_username = await interaction.options.getString('username');
    const noblox_userid_num = await noblox.getIdFromUsername(opt_username);
    const noblox_userid = await noblox_userid_num.toString();
    const noblox_username = await noblox.getUsernameFromId(noblox_userid);
    const username = JSON.stringify(noblox_username).replace(/"/g, '')
    const noblox_thumbnail = await noblox.getPlayerThumbnail(noblox_userid, 420 ,"png", true, "Bust");
    const noblox_knp = await noblox.getRankNameInGroup(knp_group, noblox_userid);
    let user_card;

    const roblox_username = await util.get_username_if_exists(opt_username);

    if (!roblox_username) {
        interaction.reply({content: "That user does not exist! Are you sure you have entered the right name?", ephemeral: true});

        return;
    }


    if (is_police) {
        user_card = await trello.get_card_by_name(
                TRELLO_LIST_ID_POLICE,
                username,
                TRELLO_USER_KEY,
                TRELLO_USER_TOKEN
        );

        const data = user_card.desc;
        const name = user_card.name;

        const logged_hours = parseInt(data.split("Hours patrolled: ")[1].split("\n"));

        const logged_minutes = parseInt(data.split("Minutes patrolled: ")[1].split("\n"));

      
    if (Number.isNaN(logged_hours) || Number.isNaN(logged_minutes)) {
      return;
    }

      const LogEmbed = new EmbedBuilder()
      .setTitle(roblox_username)
      .setThumbnail(noblox_thumbnail[0].imageUrl)
      .setDescription("Log check")
      .addFields({name: "Rank: ", value: noblox_knp})
      .addFields({name: "Hours patrolled: ", value: logged_hours.toString(), inline: true })
      .addFields({name: "Minutes patrolled: ", value: logged_minutes.toString(), inline: true})
      .setTimestamp();

interaction.reply({embeds: [ LogEmbed ], ephemeral: true });
        } else {
          interaction.reply("According to your roles, you are not a member of the Police. Please use your own log system or ensure you have the correct roles to run this command.");
        }
    }
};
