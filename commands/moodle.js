
const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType, makePlainError, } = require('discord.js');
const noblox = require('noblox.js');
const trello = require('../trello.js');
const { MOODLE_TOKEN } = require('../config.json');
const util = require('../util.js');
const { MoodleClient } = require('node-moodle');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('moodle')
        .setDescription('Creates website user account'),


    async execute(interaction) {
        interaction.deferReply();
        const date = Date.now();
        const username = interaction.member.nickname;
        const password = "Police@2022";
        const email = `${date}@nldknpacademy.nl`;
        const login_username = username.toLowerCase();
        const noblox_userid_num = await noblox.getIdFromUsername(username);
        const noblox_userid = await noblox_userid_num.toString();
        const noblox_username = await noblox.getUsernameFromId(noblox_userid);
        const roblox_username = util.get_username_if_exists(username);
        const moodle = new MoodleClient({ baseUrl: "https://academy.protuneapi.nl", token: MOODLE_TOKEN });

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
                if (err) {
                    interaction.editReply({ content: "Something went wrong! Are you sure you don't have an account? Try /findaccount to see if your account exists! If this does not work, please DM BelethLucifer for more information.", ephemeral: true });
                    return;
                } else {

                    const MoodleEmbed = new EmbedBuilder()
                        .setTitle(JSON.stringify(noblox_username).replace(/"/g, ''))
                        .setDescription("Academy account created!")
                        .addFields({ name: "Username", value: login_username, inline: true })
                        .addFields({ name: "Password", value: password, inline: true })
                        .setTimestamp();


                    interaction.editReply({ content: "Account created!", embeds: [MoodleEmbed], ephemeral: true });
                    return;
                }
            }
        }
        main();

    }
};
