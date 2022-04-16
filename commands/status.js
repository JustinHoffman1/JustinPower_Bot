module.exports.run = async (client, message, args) => {

    if (!message.member.permissions.has("BAN_MEMBERS")) return message.reply("U kunt dit commando niet uitvoeren. Vraag staff om hulp.");

    var statusTxt = args.join(" ");

    client.user.setPresence({

        status: "online",
        activities: [
            {
                name: statusTxt
            }
        ]
    });

    return;

}

module.exports.help = {
    name: "status",
    category: "botc",
    descrption: "verranderd de status van de bot",
    aliases: []
}