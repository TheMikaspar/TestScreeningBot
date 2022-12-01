const http = require("superagent");
const util = require("./util.js");


const base_url = "https://groups.roblox.com/v1/groups";

exports.get_knp_members = async (groupId, sortOrder, limit) => {
    const url = `${base_url}/${groupId}/users?sortOrder=${sortOrder}&limit=${limit}`;

    let data = null;

    await http
        .get(url)
        .then(response => data = response.body)
        .catch(error => util.process_error(error));

    return data;
}
