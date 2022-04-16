const botConfig = require("../botConfig.json");

module.exports.run = async (client, message, args) => {

    try {

        var prefix = botConfig.prefix;

        var respone = "**Bot commands**\r\n\n";
        var general = "**__Algemeen__**\r\n";
        var info = "\n**__Informatie__**\r\n";
        var staff = "\n**__Staff__**\r\n";
        var botc = "\n**__Bot__**\r\n";

        client.commands.forEach(command => {

            switch (command.help.category) {

                case "general":
                    general += `${prefix}${command.help.name} - ${command.help.descrption}\r\n`;
                    break;
                case "info":
                    info += `${prefix}${command.help.name} - ${command.help.descrption}\r\n`;
                    break;
                case "staff":
                    staff += `${prefix}${command.help.name} - ${command.help.descrption}\r\n`;
                    break;
                case "botc":
                    botc += `${prefix}${command.help.name} - ${command.help.descrption}\r\n`;
                    break;

            }

        });

        respone += general + info + staff + botc;

        message.author.send(respone).then(() => {
            return message.reply("Alle commands kunt u vinden in uw pm");
        }).catch(() => {
            return message.reply("U heeft uw pm uitgeschakeld gelieve inschakelen");
        });

    } catch (error) {
        message.reply("Er is een probleem opgelopen.");
        console.log(error);
    }

}

module.exports.help = {
    name: "help",
    category: "info",
    descrption: "geeft commands",
    aliases: []
}