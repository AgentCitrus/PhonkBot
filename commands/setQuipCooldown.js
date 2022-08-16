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
        if (interaction.options.getString('cooldown') <= 0) {
            await interaction.reply(`Please enter a valid maximum cooldown value.`)
        }

        let servObj = serverData.filter(data => data.server == interaction.guild.id).at(0);
        servObj.defaultQuipCooldown = interaction.options.getNumber('cooldown');

        file.set("serverData", serverData.map(obj => (servObj.server == obj.server ? servObj : obj)));
        file.save();

        await interaction.reply(`Set the maximum server quip cooldown to **${interaction.options.getNumber('cooldown')}**`);
	},
};
