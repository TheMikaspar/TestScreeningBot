// Credits BelethLucifer(Mika#5285), Valatos and TheStrikes.
// Last update: 03/12/2022 Finally works perfectly. Ready for usage.

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const noblox = require('noblox.js');
const { MOODLE_TOKEN, ACADEMY_MAIL, MOODLE_URL, ACADEMY_PASS } = require('../config.json');
const { MoodleClient } = require('../moodle/index.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('moodle')
        .setDescription('Creates website user account'),


    async execute(interaction) {
        const date = Date.now();
        const username = interaction.member.nickname;
        const password = ACADEMY_PASS;
        const email = `${date}${ACADEMY_MAIL}`;
        const login_username = username.toLowerCase();
        const noblox_userid_num = await noblox.getIdFromUsername(username);
        const noblox_userid = await noblox_userid_num.toString();
        const noblox_username = await noblox.getUsernameFromId(noblox_userid);
        const noblox_thumbnail = noblox.getPlayerThumbnail(noblox_userid, 420, "png", true, "Bust");
        const moodle = new MoodleClient({ baseUrl: MOODLE_URL, token: MOODLE_TOKEN });

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
                            preferences: [
                                {
                                    type: 'auth_forcepasswordchange',
                                    value: 1,
                                }
                            ]
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
            }
            catch (err) {
                console.log(err);
                if (err) {
                    interaction.reply({ content: "Something went wrong! Are you sure you don't have an account? Try /findaccount to see if your account exists! If this does not work, please DM BelethLucifer for more information.", ephemeral: true });
                    return;
                }
            }
            const MoodleEmbed = new EmbedBuilder()
                .setTitle(JSON.stringify(noblox_username).replace(/"/g, ''))
                .setThumbnail(noblox_thumbnail[0].imageUrl)
                .setDescription("Academy account created!")
                .addFields({ name: "Username", value: login_username, inline: true })
                .addFields({ name: "Password", value: password, inline: true })
                .addFields({ name: "Important", value: "Your password must be reset immediately, you cannot skip this." })
                .setTimestamp();


            interaction.reply({ content: "Account created!", embeds: [MoodleEmbed], ephemeral: true });
            return;
        }
        main();

    }
};
