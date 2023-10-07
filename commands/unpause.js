const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unpause')
		.setDescription('Unpauses the current song.'),
	async execute(interaction) {
        player.unpause();
        await interaction.reply(`**Song unpaused.**`);
	},
};
