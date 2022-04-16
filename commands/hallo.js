const testSchema = require("../test-schema");

module.exports.run = async (client, message, args) => {

    await new testSchema({
        bericht: "Dit is een test vanuit hallo."
    }).save();

    return message.channel.send("Testing don't use me");

}

module.exports.help = {
    name: "hallo",
    category: "general",
    descrption: "zegt hallo",
    aliases: []
}