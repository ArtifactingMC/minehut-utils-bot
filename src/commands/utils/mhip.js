const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch')
require("dotenv").config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ip')
        .setDescription(`Displays the connection IPS's for Minehut.`)
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
            .setTitle(`Minehut's IP`)
            .setDescription(`You can connect to minehut via the following IP's`)
            .addField('Java Edition:', 'minehut.com', true)
            .addField('Bedrock Edition:', 'bedrock.minehut.com:`19132`', true)
            .setFooter({ text: `Minehut Utils ${process.env.VERSION}`, iconURL: 'https://github.com/ArtifactingMC/mhstatsbot-assets/raw/main/logo.png'})
            .setTimestamp()

        if (hidden) {
            await interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
            await interaction.reply({ embeds: [embed], ephemeral: false });
        }
    }
};

