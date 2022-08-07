const { SlashCommandBuilder } = require('discord.js');
const Dice = require('dice-notation-js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Rolls a dice up to the specified number.')
        .addStringOption(option =>
            option.setName('roll')
            .setDescription('The roll in dice notation.')
            .setRequired(true)),
	async execute(interaction) {
		try {
            let roll = await Dice.detailed(interaction.options.getString('roll'));
            await interaction.reply(`**${interaction.user}** rolled a ${roll.number}d${roll.type}+${roll.modifier}:
            ${roll.rolls} + ${roll.modifier} = **${roll.result}**`);
        } catch (error) {
            console.log(error);
            await interaction.reply('Please format your roll in dice notation (i.e. 2d6+3)');
        }
	},
};
