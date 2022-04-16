const ms = require("ms");

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

    var muteTime = args[1];

    if (!muteTime) return message.channel.send("Geef hoelang door.");

    if (mutePerson.roles.cache.some(role => role.name === "muted")) {
        message.channel.send("De persoon is al gemute.");
    } else {
        mutePerson.roles.add(muteRole.id);
        message.channel.send(`${mutePerson} is gemute voor ${muteTime}.`);

        if (!mute[mutePerson]) mute[mutePerson] = {
            time: 0
        };

        let date = new Date();
        let dateMilli = date.getTime();
        let dateAdded = dateMilli + ms(muteTime);

        mute[mutePerson].time = dateAdded;

        fs.writeFile("./mute.json", JSON.stringify(mute), (err) => {
            if (err) console.log(err);
        });

        // setTimeout(() => {

        //     mutePerson.roles.remove(muteRole.id);
        // message.channel.send(`${mutePerson} is geunmute`)

        // }, ms(muteTime));
    }

}

module.exports.help = {
    name: "mute",
    category: "staff",
    descrption: "mute personen",
    aliases: []
}