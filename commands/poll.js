const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('poll')
		.setDescription('Automagically creates a yes/no poll with a description and choices.')
        .addStringOption(option =>
            option.setName('description')
            .setDescription('The description of the poll.')
            .setRequired(true)),
	async execute(interaction) {
		const embedPoll = new EmbedBuilder()
            .setTitle(`${interaction.options.getString('desc')}`)
            .setAuthor({ name: `${interaction.user.username}`, iconURL: `${interaction.user.avatarURL()}` })
            .setDescription('Answer below.');
        interaction.reply({ embeds: [embedPoll] });
        interaction.fetchReply()
            .then(reply =>
                reply.react('👍'));
        interaction.fetchReply()
            .then(reply =>
                reply.react('👎'));
	},
};
