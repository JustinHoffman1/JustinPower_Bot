const fs = require("fs");
const vloekSchema = require("../vloek-schema");

module.exports.run = async (client, message, args) => {

    await new vloekSchema({
        bericht: "Iemand heeft geprobeerd een vloekword toe te voegen"
    }).save();

    if (!message.member.permissions.has("KICK_MEMBERS")) return message.reply("U kunt dit commando niet uitvoeren. Vraag staff om hulp.");

    if (!args[0]) return message.reply("Gelieve een vloekwoord meegeven");

    var word = args[0].toLowerCase();

    var swearWordsJson = fs.readFileSync("./Data/SwearWords.json", "utf-8");
    var swearWords = JSON.parse(swearWordsJson);

    swearWords.push(word);

    swearWordsJson = JSON.stringify(swearWords);
    fs.writeFileSync("./Data/SwearWords.json", swearWordsJson, "utf-8");

    return message.channel.send(`Het vloek woord **${word}** is tegevoegd aan de blacklist`);

}

module.exports.help = {
    name: "addswearword",
    category: "staff",
    descrption: "voegt vloek worden toe aan de blacklist",
    aliases: ["swear", "add", "addword", "addswear", "vloekword", "addvloekword", "addvloek"]
}