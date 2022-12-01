module.exports = {
  name: 'interactionCreate',
  execute(interaction) {
    let date_ob = new Date();
    let day = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let pre_hours = date_ob.getHours();
    let pre_minutes = date_ob.getMinutes();

    if (pre_hours >= 10) {
      var hours = pre_hours;
    } else {
      var hours = `0${pre_hours}`;
    };

    if (pre_minutes >= 10) {
      var minutes = pre_minutes;
    } else {
      var minutes = `0${pre_minutes}`;
    };

    let timestamp = `[${day}/${month}/${year} @ ${hours}:${minutes}]`;
    console.log(`${timestamp}${interaction.user.tag} in #${interaction.channel.name} triggered "/${interaction.commandName}"`);
  },
};
