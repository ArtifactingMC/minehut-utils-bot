const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch')
require("dotenv").config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('docs')
        .setDescription('Displays the skript documentation.')
        .addBooleanOption(option => option
            .setName("hidden")
            .setRequired(false)
            .setDescription("Wether this should be hidden to only you or not.")),
    async execute(interaction) {
        let hidden;
        try {
            hidden = interaction.options.getBoolean('hidden')
        } catch (e) {
            hidden = false
        }


        const embed = new MessageEmbed()
            .setColor('AQUA')
            .setTitle('Skript Documentation')
            .setDescription('Skript documentation, sometimes referred to as "the docs" are a great resource for beginners learning skript or experts reviewing a topic. They hold a wide variety of information on various events, conditions, effects, and expressions. Heres a few popular documentation websites: \n \n [• Skript Lang Github](https://docs.skriptlang.org/index.html) \n[• Skript Lang Github](https://docs.skriptlang.org/index.html) \n[• Skript Hub Docs](https://skripthub.net/docs/) \n [• SkUnity Docs](https://docs.skunity.com/syntax/) \n[• Bukkit Dev](https://dev.bukkit.org/projects/skript) \n[• skUnity Parser](https://parser.skunity.com/) - Another Great tool is the skunity parser, whitch can parse (run) your skript code in a web broswer and check for errors')
            .setFooter({ text: `Minehut Utils ${process.env.VERSION}`, iconURL: 'https://github.com/ArtifactingMC/mhstatsbot-assets/raw/main/logo.png'})
            .setTimestamp()

        if (hidden) {
            await interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
            await interaction.reply({ embeds: [embed], ephemeral: false });
        }
    }
};

