const Discord = require('discord.js');


module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`${client.user.username} logged in!`);
        console.log('Bot has started successfully!') // To make my host solution mark the bot as online lmao

        client.user.setActivity(`Minehut API`, ({type: "WATCHING"}))

    }
}

