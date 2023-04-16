const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('resume')
		.setDescription('Resumes the current song.'),
	async execute(interaction) {
        player.unpause();
        await interaction.reply(`**Song resumed.**`);
	},
};
