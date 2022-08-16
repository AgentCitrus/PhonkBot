const path = require('path');
const { SlashCommandBuilder } = require('discord.js');
const editJsonFile = require('edit-json-file');
const { serverData } = require('../config.json');

let file = editJsonFile(path.join(__dirname, '../config.json'));

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cc')
		.setDescription('Create or use a server-specific custom command.')
        .addStringOption(option =>
            option.setName('command')
            .setDescription('The name of the custom command.')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('value')
            .setDescription('The value of the custom command, if you\'re setting it.')),
	async execute(interaction) {
		let servObj = serverData.filter(data => data.server == interaction.guild.id).at(0);
        
        if (interaction.options.getString('value')) {
            servObj.customCommands[`${interaction.options.getString('command')}`] = interaction.options.getString('value');
            file.set("serverData", serverData.map(obj => (servObj.server == obj.server ? servObj : obj)));
            file.save();
            await interaction.reply(`Custom command '${interaction.options.getString('command')}' with value '${interaction.options.getString('value')}' set.`);
        } else if (servObj.customCommands.hasOwnProperty(interaction.options.getString('command'))) {
            await interaction.reply(servObj.customCommands[`${interaction.options.getString('command')}`]);
        } else {
            await interaction.reply(`Custom command ${interaction.options.getString('command')} not found.`)
        }
	},
};
