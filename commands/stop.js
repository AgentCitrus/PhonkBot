const { SlashCommandBuilder } = require('discord.js');
const { serverData } = require('../config.json');
const editJsonFile = require('edit-json-file');
const path = require('path');

let file = editJsonFile(path.join(__dirname, '../config.json'));

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Ends the current song and clears the queue.'),
	async execute(interaction) {

        let servObj = serverData.filter(data => data.server == interaction.guild.id).at(0);

        player.stop();
        servObj.queue = [];

        file.set("serverData", serverData.map(obj => (servObj.server == obj.server ? servObj : obj)));
        file.save();

        await interaction.reply(`Queue cleared!`);
	},
};
