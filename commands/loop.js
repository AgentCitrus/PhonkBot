const { SlashCommandBuilder } = require('discord.js');
const { serverData } = require('../config.json');
const editJsonFile = require('edit-json-file');
const path = require('path');

let file = editJsonFile(path.join(__dirname, '../config.json'));

module.exports = {
	data: new SlashCommandBuilder()
		.setName('loop')
		.setDescription('Loops either the current song, or the entire track list.')
        .addStringOption(option =>
            option.setName('option')
                .setDescription('How to loop the queue, or to turn the loop off.')
                .setRequired(true)
                .addChoices(
                    { name: 'off', value: 'off' },
                    { name: 'on', value: 'on' }
                )),
	async execute(interaction) {
        let servObj = serverData.filter(data => data.server == interaction.guild.id).at(0);

        if (!interaction.member.voice.channel) {
            await interaction.reply(`You must be in a voice channel to use this command!`);
            return;
        }

        servObj.loop = interaction.options.getString('option');
        await interaction.reply(`Set loop to ${interaction.options.getString('option')}`)
	},
};
