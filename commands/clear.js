module.exports.run = async (client, message, args) => {

    // !clear aantal

    if (!message.member.permissions.has("MANAGE_MESSAGES")) return message.reply("U kunt dit command niet uitvoeren. Vraag aan staff A.U.B.");

    if (!args[0]) return message.reply("U moet een aantal geven");

    if (parseInt(args[0])) {

        var amount = parseInt(args[0]) + 1;

        message.channel.bulkDelete(amount).then(() => {

            if (parseInt(args[0]) == 1) {
                message.channel.send("Ik heb **1 bericht** verwijderd.").then(msg => {
                    setTimeout(() => {
                        msg.delete()
                    }, 3000);
                });
            } else {
                message.channel.send(`Ik heb **${parseInt(args[0])} berichten** verwijderd.`).then(msg => {
                    setTimeout(() => {
                        msg.delete()
                    }, 3000);
                });
            }

        }).catch(err => {
            return message.reply("U moet een getal groter dan 0 opgeven.");
            console.log(err);
        });

    } else {
        return message.reply("U moet een getal opgeven");
    }

}

module.exports.help = {
    name: "clear",
    category: "staff",
    descrption: "Verwijderd berichten",
    aliases: []
}