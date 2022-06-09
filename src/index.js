const {Client, Intents, Collection } = require('discord.js');
const fs = require('fs');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS] });

client.commands = new Collection();

require("dotenv").config();


const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const eventsFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");
(async () => {
    for (let file of functions) {
        require(`./functions/${file}`)(client);
    }
    client.handleEvents(eventsFiles, "./src/events");
    client.handleCommands(commandFolders, "./src/commands")
    await client.login(process.env.TOKEN);
})();

