const { SlashCommandBuilder } = require('discord.js');
const { serverData } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nowplaying')
		.setDescription('Sends the YouTube URL currently playing.'),
	async execute(interaction) {
        let servObj = serverData.filter(data => data.server == interaction.guild.id).at(0);
        await servObj.queue[0] ? interaction.reply(`**Now playing:** ${servObj.queue[0]}`) : interaction.reply('The queue is empty!');
	},
};
