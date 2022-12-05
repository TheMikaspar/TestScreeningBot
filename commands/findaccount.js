// Credits BelethLucifer(Mika#5285), Valatos and TheStrikes.
// Last update: 05/12/2022 Finally works perfectly. Ready for usage.

const { SlashCommandBuilder } = require('discord.js');
const { MOODLE_TOKEN, MOODLE_URL } = require('../config.json');
const { MoodleClient } = require('../moodle/index.js');
const noblox = require('noblox.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('findaccount')
        .setDescription('Checks if you have an academy account yet'),


    async execute(interaction) {
        interaction.deferReply({ ephemeral: true });

        const duser = await interaction.member.user.username;
        const rusername = await interaction.member.nickname;

        if (rusername !== null) {
            var username = rusername;
        } else {
            var username = duser;
        }

        const noblox_userid_num = await noblox.getIdFromUsername(username);
        const noblox_userid = await noblox_userid_num.toString();
        const noblox_username = await noblox.getUsernameFromId(noblox_userid);
        const moodle = new MoodleClient({ baseUrl: MOODLE_URL, token: MOODLE_TOKEN });

        async function main() {
            try {
                var user_search_req = {
                    criteria: [
                        {
                            key: "firstname",
                            value: noblox_username
                        }
                    ]
                };
                const user_search = await moodle.core.user.getUsers(user_search_req);

                if (user_search.users == "[]") {
                    interaction.editReply({ content: `An Academy account was found. Your username is: ` + "`" + `${user_search.users[0].username}` + "`" + `. If you have forgotten your password, please contact a member of the Academy command. `, ephemeral: true });
                    return;
                } else {
                    interaction.editReply({ content: `We could not find an account for that username. Try making an account again, or contact a member of the academy command. If you believe there is an issue with the bot, contact BelethLucifer.` });
                    return;
                }

            }
            catch (err) {
                console.log(err);
                if (err) {
                    interaction.editReply({ content: "Something went wrong! Please contact BelethLucifer for more information.", ephemeral: true });
                    return;
                }
            }


        }
        main()
    }
};