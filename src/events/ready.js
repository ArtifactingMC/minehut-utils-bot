const Discord = require('discord.js');


module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`${client.user.username} logged in!`);

        client.user.setActivity(`Minehut API`, ({type: "WATCHING"}))

    }
}

