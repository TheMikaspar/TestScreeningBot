
const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType, makePlainError, } = require('discord.js');
const noblox = require('noblox.js');
const trello = require('../trello.js');
const { MOODLE_TOKEN } = require('../config.json');
const util = require('../util.js');
const { MoodleClient } = require('node-moodle');

module.exports = {
    data: new SlashCommandBuilder()
          .setName('moodle')
          .setDescription('Creates website user account')
          .addStringOption(option => 
            option.setName('username')
            .setDescription("Roblox username")
            .setRequired(true))
        .addStringOption(option =>
            option.setName('password')
            .setDescription("Your preferred password. Must have one of each: 1-10, a-z, A-Z, !-&")
            .setRequired(true))
        .addStringOption(option =>
            option.setName('email')
            .setDescription("Email address you wish to use")
            .setRequired(true)),
       
       
          async execute(interaction) {
        const username = interaction.options.getString('username');
        const password = interaction.options.getString('password');
        const email = interaction.options.getString('email');
        const login_username = username.toLowerCase();
        const noblox_userid_num = await noblox.getIdFromUsername(username);
        const noblox_userid = await noblox_userid_num.toString();
        const noblox_username = await noblox.getUsernameFromId(noblox_userid); 
        const roblox_username = util.get_username_if_exists(username);
        const moodle = new MoodleClient({baseUrl:"https://academy.protuneapi.nl", token: MOODLE_TOKEN});
        
        async function main() {
            try {
                var user_req = {
                    users: [
                        {
                            firstname: noblox_username,
                            lastname: "-",
                            username: login_username,
                            password: password,
                            email: email,
                        }
                    ]
                };
        const user = await moodle.core.user.createUsers(user_req);
        const enrol_userid = user[0].id
        const enrol_id = parseInt(enrol_userid)
        console.log(user);
        console.log(enrol_userid);
                var enrol_req = {
                    enrolments: [
                        {
                    roleid: 9,
                    userid: enrol_id,
                    courseid: 2,
                        }
                ]
              }
                var enrol = await moodle.enrol.manual.enrolUsers(enrol_req);
                console.log(enrol)
            }
            catch (err) {
                console.log(err);
            }
        }
        main();


        const MoodleEmbed = new EmbedBuilder()
        .setTitle(JSON.stringify(noblox_username).replace(/"/g, ''))
        .setDescription("Academy account created!")
        .addFields({name: "Username", value: login_username, inline: true})
        .addFields({name: "Password", value: password, inline: true})
        .setTimestamp();

        interaction.reply({content: "Account created!", embeds: [MoodleEmbed], ephemeral: true});
    }
};
