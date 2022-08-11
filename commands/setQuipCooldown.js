const path = require('path');
const { SlashCommandBuilder } = require('discord.js');
const editJsonFile = require('edit-json-file');
const { serverData } = require('../config.json');

let file = editJsonFile(path.join(__dirname, '../config.json'));

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setquipcooldown')
		.setDescription('Sets the maximum quip cooldown for the server.')
        .addNumberOption(option =>
            option.setName('cooldown')
            .setDescription('The specified cooldown.')
            .setRequired(true)),
	async execute(interaction) {
        let servObj = serverData.filter(data => data.server == interaction.guild.id);
        servObj.at(0).defaultQuipCooldown = interaction.options.getNumber('cooldown');

        file.set("serverData", serverData.map(obj => servObj.find(o => o.server === obj.server) || obj));
        file.save();

        interaction.reply(`Set the maximum server quip cooldown to **${interaction.options.getNumber('cooldown')}**`);
	},
};
