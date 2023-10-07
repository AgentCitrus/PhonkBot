const { SlashCommandBuilder } = require('discord.js');
const { serverData } = require('../config.json');
const editJsonFile = require('edit-json-file');
const path = require('path');

let file = editJsonFile(path.join(__dirname, '../config.json'));

module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Skips the current song.'),
	async execute(interaction) {
		let servObj = serverData.filter(data => data.server == interaction.guild.id).at(0);

		if (!servObj.queue.length) {
			await interaction.reply('The queue is empty.');
			return;
		}
		await player.stop();

        await interaction.reply(`Skipped current song!`);
	},
};
