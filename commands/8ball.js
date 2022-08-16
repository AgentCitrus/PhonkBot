const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('8ball')
		.setDescription('Ask a virtual magic 8 ball a yes or no question.')
        .addStringOption(option =>
            option.setName('question')
            .setDescription('The question to ask the 8 ball.')
            .setRequired(true)),
	async execute(interaction) {
		let responses = ['It is certain.', 'It is decidedly so.', 'Without a doubt.',
                        'Yes, definitely.', 'You may rely on it.', 'As I see it, yes.',
                        'Most likely.', 'Outlook good.', 'Yes.', 'Signs point to yes.',
                        'Reply hazy, try again.', 'Ask again later.', 'Better not tell you now.',
                        'Cannot predict now.', 'Concentrate and ask again.', 'Don\'t count on it.',
                        'My reply is no.', 'My sources say no.', 'Outlook not so good.', 'Very doubtful.'];
        await interaction.reply(`${interaction.user} asked: ${interaction.options.getString('question')}\nThe magic 8-ball says: **${responses[Math.floor(Math.random() * responses.length)]}**`);
	},
};
