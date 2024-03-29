const { SlashCommandBuilder } = require('discord.js');
const { request } = require('undici');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('yomama')
		.setDescription('Replies with a usually rather crude joke about your mother.'),
	async execute(interaction) {
		const result = await request('https://api.yomomma.info/');
        const jokeObj = await getJSONResponse(result.body);
        interaction.reply(jokeObj.joke);
	},
};

async function getJSONResponse(body) {
	let fullBody = '';

	for await (const data of body) {
		fullBody += data.toString();
	}

	return JSON.parse(fullBody);
}