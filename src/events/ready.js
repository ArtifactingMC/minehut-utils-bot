const Discord = require('discord.js');


module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`${client.user} logged in!`);

        client.user.setActivity(`Minehut's API`, ({type: "WATCHING"}))

    }
}

