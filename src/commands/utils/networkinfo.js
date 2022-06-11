const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch')
const QuickChart = require('quickchart-js')
require("dotenv").config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('networkinfo')
        .setDescription(`Displays the Minehut Network's statistics.`)
        .addBooleanOption(option => option
            .setName("advanced")
            .setRequired(false)
            .setDescription("More stats for stat nerds, default is false"))
        .addBooleanOption(option => option
            .setName("hidden")
            .setRequired(false)
            .setDescription("Wether this should be hidden to only you or not.")),
    async execute(interaction) {
        let hidden;
        let advanced;
        try {
            hidden = interaction.options.getBoolean('hidden')
        } catch (e) {
            hidden = false
        }

        try {
            advanced = interaction.options.getBoolean('advanced')
        } catch (e) {
            advanced = false
        }

        if (advanced === true) {
            let response = await fetch(`https://api.minehut.com/network/players/distribution`)
            let json = await response.json()

            const javaTotal = json['javaTotal']
            const javaLobby = json['javaLobby']
            const javaPlayerServer = json['javaPlayerServer']
            const bedrockTotal = json['bedrockTotal']
            const bedrockLobby = json['bedrockLobby']
            const bedrockPlayerServer = json['bedrockPlayerServer']

            const totalPlayers = javaTotal + bedrockTotal
            const totalLobbyPlayers = javaLobby + bedrockLobby
            const totalServerPlayers = javaPlayerServer + bedrockPlayerServer


            response = await fetch(`https://api.minehut.com/network/simple_stats`)
            json = await response.json()

            const server_max = json['server_max']
            const server_count = json['server_count']


            //
            // Thanks to chrishours#0001 on Discord for help with the ratio calculations
            //
            const javaBedrockRatio = Math.round(javaTotal / totalPlayers * 100)
            const javaBedrockServerRatio = Math.round(javaPlayerServer / totalServerPlayers * 100)
            const javaBedrockLobbyRatio = Math.round(javaLobby / totalLobbyPlayers * 100)




            function graphData() {

                const chart = new QuickChart();
                chart.setConfig({
                    type: 'bar',
                    data: {
                        labels: ['Total', 'Servers', 'Lobbies'],
                        datasets: [
                            {
                                label: 'Java',
                                backgroundColor: "rgb(255, 99, 132)",
                                borderColor: "rgb(255, 99, 132)",
                                data: [
                                    javaTotal,
                                    javaPlayerServer,
                                    javaLobby
                                ],
                            },
                            {
                                label: 'Bedrock',
                                backgroundColor: "rgb(54, 162, 235)",
                                borderColor: "rgb(54, 162, 235)",
                                data: [
                                    bedrockTotal,
                                    bedrockPlayerServer,
                                    bedrockLobby
                                ]
                            }
                        ]
                    },
                    options: {
                        "stacked": false,
                        "title": {
                            "display": true,
                            "text": "Minehut Network Player Statistics"
                        },
                    }
                });


                return chart.getUrl()
            }





            let advancedEmbed = new MessageEmbed()
                .setColor('GREEN')
                .setTitle(`Minehut Statistics (Advanced)`)
                .setThumbnail('https://github.com/ArtifactingMC/mhstatsbot-assets/raw/main/mhlogo.png')
                .addField('Total Players', `${totalPlayers}`, true)
                .addField('Total Servers', `${server_count}`, true)
                .addField('Java Players', `${javaTotal}`, true)
                .addField('Bedrock Players', `${bedrockTotal}`, true)
                .addField('Java -> Bedrock ratio', `${javaBedrockRatio}%`, true)
                .addField('Java Server Players', `${javaPlayerServer}`, true)
                .addField('Bedrock Server Players', `${bedrockPlayerServer}`, true)
                .addField('Java -> Bedrock Server Ratio', `${javaBedrockServerRatio}%`, true)
                .addField('Java Lobby Players', `${javaLobby}`, true)
                .addField('Bedrock Lobby Players', `${bedrockLobby}`, true)
                .addField('Java -> Bedrock Lobby Ratio', `${javaBedrockLobbyRatio}%`, true)
                .addField('Max Server Count', `${server_max}`, true)
                .setFooter({ text: `Minehut Utils ${process.env.VERSION}`, iconURL: 'https://github.com/ArtifactingMC/mhstatsbot-assets/raw/main/logo.png'})
                .setTimestamp()
                .setImage(graphData())

            await interaction.reply({ embeds: [advancedEmbed], ephemeral: hidden });
        } else {

            let response = await fetch(`https://api.minehut.com/servers`)
            let json = await response.json()

            try {

                let totalPlayers = json['total_players']
                let server_count = json['total_servers']

                let simpleEmbed = new MessageEmbed()
                    .setColor('GREEN')
                    .setTitle(`Minehut Statistics`)
                    .setThumbnail('https://github.com/ArtifactingMC/mhstatsbot-assets/raw/main/mhlogo.png')
                    .addField('Total Players', `${totalPlayers}`, true)
                    .addField('Total Servers', `${server_count}`, true)
                    .setFooter({
                        text: `Minehut Utils ${process.env.VERSION}`,
                        iconURL: 'https://github.com/ArtifactingMC/mhstatsbot-assets/raw/main/logo.png'
                    })
                    .setTimestamp()
                await interaction.reply({embeds: [simpleEmbed], ephemeral: hidden});
            } catch (e) {
                await interaction.reply({content: "An error occured while fetching information!", ephemeral: true});
            }
        }
    }
};

