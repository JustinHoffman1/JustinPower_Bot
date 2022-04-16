const fs = require("fs");
const mute = JSON.parse(fs.readFileSync("./mute.json", "utf8"));

module.exports.run = async (client, message, args) => {

    //mute gebruiker tijd(h, m, s)

    if (!message.member.permissions.has("KICK_MEMBERS")) return message.reply("U bent niet gemachtigd om dit te doen.");

    if (!args[0]) return message.reply("U moet een gebruiker meegeven.");

    var mutePerson = message.guild.members.cache.get(message.mentions.users.first().id || message.guild.members.get(args[0]).id);

    if (!mutePerson) return message.reply("Kan de gebruiker niet vinden.");

    if (mutePerson.permissions.has("MANAGE_MESSAGES")) return message.reply("U kunt geen staff een mute geven.");

    let muteRole = message.guild.roles.cache.get("962663424662319175");

    if (!muteRole) return message.channel.send("De @muted role bestaat niet.");

    if (!mutePerson.roles.cache.some(role => role.name === "muted")) {
        message.channel.send("De persoon is al geunmute.");
    } else { 
        mutePerson.roles.remove(muteRole.id);
        message.channel.send(`${mutePerson} is geunmute.`);

        mute[mutePerson].time = 0;

        fs.writeFile("./mute.json", JSON.stringify(mute), (err) => {
            if (err) console.log(err);
        });
    }

}

module.exports.help = {
    name: "unmute",
    category: "staff",
    descrption: "unmute personen",
    aliases: []
}