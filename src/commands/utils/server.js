const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch')
require("dotenv").config();

const COLOUR_CODE_EXPR = /&[0-9A-FK-OR]/gim;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Gets information on a minehut server!')
        .addStringOption(option => option
            .setName("name")
            .setRequired(true)
            .setDescription("What minehut server do you want to get information on?")),
    async execute(interaction) {
        let queriedServer = interaction.options.getString('name')

        // Checking if the option is provided, as mobile slash commands are buggy for required inputs.

        if (queriedServer) {


            const response = await fetch(`https://api.minehut.com/server/${queriedServer}?byName=true`)
            const json = await response.json()
            try {
                const server = json['server']

                function isOnline() {
                    let isOnline = server['online']
                    if (isOnline) {
                        return "GREEN"
                    } else {
                        return "RED"
                    }
                }

                function isVisible() {
                    let isVisible = server['visibility']
                    if (isVisible) {
                        return "(Visible)"
                    } else {
                        return "(Unlisted)"
                    }
                }

                function prettyDate() {
                    let date = new Date(server['last_online'])
                    const now = Math.round(date.getTime() / 1000);
                    return `<t:${now}> (<t:${now}:R>)`;
                }

                function getMaxPlayers() {
                    let isProxy = server['proxy']
                    if (isProxy) {
                        return "∞"
                    } else {
                        return server['maxPlayers']
                    }
                }

                function isSuspended() {
                    let isSuspended = server['isSuspended']
                    if (isSuspended) {
                        return "Yes"
                    } else {
                        return "No"
                    }
                }


                let embed = new Discord.MessageEmbed()
                    .setColor(isOnline())
                    .setTimestamp()
                    .setDescription(`\`\`\`${server['motd'].replaceAll(COLOUR_CODE_EXPR, '')}\`\`\``)
                    .setTitle(`${server['name']} ${isVisible()}`)
                    .setFooter({text: `Minehut Stats ${process.env.VERSION}`, iconURL: 'https://github.com/ArtifactingMC/mhstatsbot-assets/raw/main/logo.png'})
                try {
                    embed.setThumbnail(`https://minecraft-api.vercel.app/items/${server['icon'].toLowerCase()}.png`)
                } catch (e) {
                    embed.setThumbnail('https://minecraft-api.vercel.app/items/oak_sign.png')
                }


                embed.addField('Last Started', prettyDate(), true);
                if (server['online']) {
                    embed.addField('Player Count', `${server['playerCount']} / ${getMaxPlayers()}`, true)
                }
                embed.addField('Suspended', `${isSuspended()}`, true);
                embed.addField('Credits/day', Math.round(server['credits_per_day']).toString(), true);


                if(server['categories'].length > 0) embed.addField('Categories', server['categories'].map(c => `• ${c}`.trim()).join('\n'));



                await interaction.reply({embeds: [embed], ephemeral: false})
            } catch (e) {
                console.log(e)
                await interaction.reply({ content: "An error occured while fetching server information!", ephemeral: true})
            }
        } else {
            await interaction.reply({ content: "Syntax Error! You did not provide a server!"})
        }
    }
};

