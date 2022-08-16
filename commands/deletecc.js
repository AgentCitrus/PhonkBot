const path = require('path');
const { SlashCommandBuilder } = require('discord.js');
const editJsonFile = require('edit-json-file');
const { serverData } = require('../config.json');

let file = editJsonFile(path.join(__dirname, '../config.json'));

module.exports = {
	data: new SlashCommandBuilder()
		.setName('deletecc')
		.setDescription('Delete a server-specific custom command.')
        .addStringOption(option =>
            option.setName('command')
            .setDescription('The name of the custom command.')
            .setRequired(true)),
	async execute(interaction) {
		let servObj = serverData.filter(data => data.server == interaction.guild.id).at(0);
        
        if (servObj.customCommands.hasOwnProperty(interaction.options.getString('command'))) {
            delete servObj.customCommands[`${interaction.options.getString('command')}`];
            file.set("serverData", serverData.map(obj => (servObj.server == obj.server ? servObj : obj)));
            file.save();
            await interaction.reply(`Custom command ${interaction.options.getString('command')} successfully deleted.`);
        } else {
            await interaction.reply(`Custom command ${interaction.options.getString('command')} not found.`)
        }
	},
};
