const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Rolls a dice up to the specified number.')
        .addNumberOption(option =>
            option.setName('roll')
            .setDescription('The maximum rollable number.')
            .setRequired(true)),
	async execute(interaction) {
		await interaction.reply('You rolled **' + (Math.floor(Math.random() * interaction.options.getNumber('roll')) + 1) + '**.');
	},
};
