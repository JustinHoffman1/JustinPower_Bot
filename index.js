const { Client, Intents, Message, Collection, MessageEmbed } = require("discord.js");
const botConfig = require("./botConfig.json");
const fs = require("fs");
const mongoose = require("mongoose");
require("dotenv").config();

const mute = JSON.parse(fs.readFileSync("./mute.json", "utf8"));
const swearWords = require("./Data/SwearWords.json");
const levelFile = require("./Data/levels.json");

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_PRESENCES]
});

client.commands = new Collection();
client.aliases = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith(".js"));

for (const file of commandFiles) {

    const command = require(`./commands/${file}`);

    client.commands.set(command.help.name, command);

    command.help.aliases.forEach(alias => {
        client.aliases.set(alias, command.help.name);
    });

    console.log(`✅ | ${command.help.name}.js is geladen`);

}

client.once("ready", async () => {
    console.log(`✅ | ${client.user.username} is online.`);
    client.user.setActivity("Testing", { type: "PLAYING" });
    client.user.setStatus('dnd');

    await mongoose.connect(
        process.env.MONGO_URI,
        {
            keepAlive: true
        }
    );

    const statusOptions = [
        "Testing",
        "?help",
        "?serverinfo"
    ]

    let counter = 0;

    // let time = 1 * 60 * 1000; // 1 Minuut
    let time = 10 * 1000;

    const updateStatus = () => {

        client.user.setPresence({

            status: 'dnd',
            activities: [
                {
                    name: statusOptions[counter]
                }
            ]
        });

        if (++counter >= statusOptions.length) counter = 0;

        setTimeout(updateStatus, time);

    }
    updateStatus()

    const checkMute = async () => {

        // Omdat we over object propertys gaan moeten we dit anders doen dan een array.
        // We gaan hier over iedere key in het object gaan in het mutes.json bestand.
        for (const result of Object.keys(mute)) {
            // We halen het ID er uit.
            const idMember = result;
            // We halen de tijd op vanuit het hele bestand bij die key (ID) en dan de tijd.
            const time = mute[result].time;

            // Tijd van nu ophalen.
            let date = new Date();
            let dateMilli = date.getTime();
            // Tijd bij gebruiker omvormen naar leesbare tijd.
            let dateReset = new Date(time);

            // Als de tijd van het muten kleiner is als de tijd van nu en de tijd staat niet op 0
            // dan mag deze persoon verlost worden van het zwijgen.
            if (dateReset < dateMilli && time != 0) {

                try {
                    // We halen de server op.
                    let guild = await client.guilds.fetch("ID");
                    // We gaan de persoon gegevens ophalen aan de hand van de idMember waar we de tekens < @ ! > weghalen.
                    const mutePerson = guild.members.cache.find(member => member.id === idMember.replace(/[<@!>]/g, ''));
                    // We halen de rol op.
                    let muteRole = guild.roles.cache.get('ID');
                    // We kijken na als de rol bestaat.
                    if (!muteRole) return console.log("De rol muted bestaat niet.");
                    // We verwijderen de rol van de persoon.
                    await (mutePerson.roles.remove(muteRole.id));
                    // We zetten de tijd op 0.
                    mute[mutePerson].time = 0;
                    // We slaan dit mee op in het document.
                    fs.writeFile("./mute.json", JSON.stringify(mute), (err) => {
                        if (err) console.log(err);
                    });
                }
                catch (err) {
                    console.log(err + " Persoon kon niet geunmute worden wegens deze persoon niet meer op de server is");
                }
            }
        }
        setTimeout(checkMute, 1000 * 60); // We zetten een timeout van 1 minuut.
    }
    checkMute(); // We starten de functie met de timeout.

    const guild = client.guilds.cache.get("909178647351533618");

    let commands;

    if (guild) {
        commands = guild.commands;
    } else {
        commands = client.application.commands;
    }

});

client.on("guildMemberAdd", async member => {

    var role = member.guild.roles.cache.get("909439909545259019");

    if (!role) return;

    member.roles.add(role);

    var channel = member.guild.channels.cache.get("909466412681142314");

    if (!channel) return;

    channel.send(`${member}, welkom op **JustinPower Official**`);

    // Omdat we over object propertys gaan moeten we dit anders doen dan een array.
    for (const result of Object.keys(mute)) {
        // Voor meer uitleg zie vorig stuk.
        const idMember = result;
        const time = mute[result].time;

        // We kijken na als het de persoon is die op de server is gekomen.
        if (idMember.replace(/[<@!>]/g, '') == member.id) {

            let date = new Date();
            let dateMilli = date.getTime();
            let dateReset = new Date(time);

            let muteRole = member.guild.roles.cache.get('962663424662319175');

            if (!muteRole) return message.channel.send("De rol muted bestaat niet");

            try {
                // Als de tijd van de mute nog groter is dan de tijd van nu moet die de rol terug krijgen.
                if (dateReset > dateMilli) {
                    await (member.roles.add(muteRole.id));
                } else if (time != 0) {
                    // Anders mag de rol weg maar omdat deze opnieuw aanmeld is deze al weg en gaan we enkel
                    // de tijd op nul zetten zodat we niet nog eens moeten opslaan.
                    let guild = await client.guilds.fetch("962663424662319175");
                    const mutePerson = guild.members.cache.find(member => member.id === idMember.replace(/[<@!>]/g, ''));
                    mute[mutePerson].time = 0;

                    fs.writeFile("./mutes.json", JSON.stringify(mute), (err) => {
                        if (err) console.log(err);
                    });
                }
            } catch (err) {
                console.log(err + " Iets liep mis met de rollen toevoegen/verwijderen.");
            }
        }
    }

});

client.on("messageCreate", async message => {

    if (message.author.bot) return;

    var prefix = botConfig.prefix;

    var messageArray = message.content.split(" ");

    var command = messageArray[0];

    if (!message.content.startsWith(prefix)) {

        RandomXP(message);

        var msg = message.content.toLocaleLowerCase();

        for (let index = 0; index < swearWords.length; index++) {
            const swearWord = swearWords[index];

            if (msg.includes(swearWord.toLocaleLowerCase())) {

                message.delete();
                return await message.channel.send("U mag niet vloeken.").then(msg => {
                    setTimeout(() => {
                        msg.delete()
                    }, 3000);
                });

            }

        }

    }
    else {
        const commandData = client.commands.get(command.slice(prefix.length)) || client.commands.get(client.aliases.get(command.slice(prefix.length)));

        if (!commandData) return;

        var arguments = messageArray.slice(1);

        try {

            await commandData.run(client, message, arguments);

        } catch (error) {
            console.log(error);
            await message.reply("Er is een probleem opgelopen.");
        }
    }
});

function RandomXP(message) {

    var randomXP = Math.floor(Math.random() * 15) + 1;

    console.log(randomXP);

    var idUser = message.author.id;

    if (!levelFile[idUser]) {

        levelFile[idUser] = {
            xp: 0,
            level: 0
        }

    }

    levelFile[idUser].xp += randomXP;

    var levelUser = levelFile[idUser].level;
    var xpUser = levelFile[idUser].xp;
    var nextLevelXp = levelUser * 300;
    var authorXp = message.author.username;
    var levelChannel = message.member.guild.channels.cache.find(channel => channel.name === "🔼levels");

    if (nextLevelXp == 0) nextLevelXp = 100;

    if (xpUser >= nextLevelXp) {

        levelFile[idUser].level += 1;

        fs.writeFile("./Data/levels.json", JSON.stringify(levelFile),
            err => {
                if (err) console.log("Er is iet misgegaan.");
            });
        var embedLevel = new MessageEmbed()
            .setColor("GREEN")
            .setTitle(`${authorXp}`)
            .addField("Nieuw level gehaald:", levelFile[idUser].level.toString());
        levelChannel.send({ embeds: [embedLevel] });
    }

}

client.login(process.env.token);