const { readdirSync } = require("fs");
const util = require("../util.js");

// Note: The :white_check_mark: emoji is \u2705 in unicode.
//       I will have to use that, as my text editor doesn't support adding
//       emoji's straight to the code.

function check_permissions(member, command_info) {
    // If a command requires the user to be in the High Command, check if they have the
    // required High Command role.
    if (command_info.requires_hc) {
        if (member.roles.cache.find(role => role.id == HC_ROLE_ID_POLICE) != undefined ) {
            return true;
        }
    } else {
        // We don't require a High Command role, so we're allowed to execute this command.
        // Although we might still not be able to execute the command, depending on if the command
        // can only be executed in a specific channel.
        return true;
    }

    return false;
}

function check_message(client, message) {
    if (message.author.bot) return;             // Don't respond to bots, only to actual users.
    if (!message.guild) return;                 // The message has not been sent in a guild.
    if (!message.guild.available) return;       // Only read messages if this server is available. If it's not, there might be a server outrage.
    if (message.channel.type != "text") return; // Only try to use commands if it is actually used in a server.
}
