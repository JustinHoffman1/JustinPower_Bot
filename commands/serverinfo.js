const discord = require("discord.js");

module.exports.run = async (client, message, args) => {

    var botEmbed = new discord.MessageEmbed()
        .setTitle("Een titel")
        .setDescription("Een beschrijving")
        .setColor("#0099ff")
        .addFields(
            { name: "Bot naam", value: client.user.username },
            { name: "U bent de server gejoined op", value: message.member.joinedAt.toString() },
            { name: "Totaal members", value: message.guild.memberCount.toString() }
        );

    return message.channel.send({ embeds: [botEmbed] });

}

module.exports.help = {
    name: "serverinfo",
    category: "info",
    descrption: "geeft server informatie",
    aliases: []
}