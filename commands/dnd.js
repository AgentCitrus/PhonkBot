const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { request } = require('undici');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dnd')
		.setDescription('Access the D&D 5E API and retrieve information from the official D&D 5E SRD.')
        .addStringOption(option =>
            option.setName('type')
            .setDescription('The type of game feature you would like to search for.')
            .setRequired(true)
            .addChoices(
                { name: 'race', value: 'races' },
                { name: 'class', value: 'classes' },
                { name: 'spell', value: 'spells' },
                { name: 'feature', value: 'features' },
                { name: 'trait', value: 'traits' },
                { name: 'monster', value: 'monsters' }
            ))
        .addStringOption(option =>
            option.setName('feature')
            .setDescription('The game feature you would like to search for.')
            .setRequired(true)),
	async execute(interaction) {
        const searchResult = await request(`https://www.dnd5eapi.co/api/${interaction.options.getString('type')}/${interaction.options.getString('feature').replaceAll(' ', '-').toLowerCase()}`);
        const body = await getJSONResponse(searchResult.body);

        if (body.hasOwnProperty('error')) {
            await interaction.reply(`${capitalize(interaction.options.getString('type'))} '${interaction.options.getString('feature')}' not found`);
            return;
        }

        const infoEmbed = new EmbedBuilder()
            .setColor(0x0099FF);

        switch (interaction.options.getString('type')) {
            case 'races':
                infoEmbed.setTitle(`${body.name}`)
                    .addFields(
                        { name: 'Speed', value: `${body.speed} ft` },
                        { name: 'Ability Bonuses', value: `${body.ability_bonuses.length ? 
                            body.ability_bonuses.map(elem => `${elem.ability_score.name} +${elem.bonus}`).join(`\r\n`) : 'None'}` },
                        { name: 'Age', value: `${body.age}` },
                        { name: 'Alignment', value: `${body.alignment}` },
                        { name: 'Size', value: `${body.size}` },
                        { name: 'Size Description', value: `${body.size_description}` },
                        { name: 'Starting Proficiencies', value: `${body.starting_proficiencies.length ?
                            body.starting_proficiencies.map(elem => elem.name).join(`\r\n`) : 'None'}` },
                        { name: 'Languages', value: `${body.languages.length ?
                            body.languages.map(elem => elem.name).join(`\r\n`) : 'None'}` },
                        { name: 'Traits', value: `${body.traits.length ?
                            body.traits.map(elem => elem.name).join(`\r\n`) : 'None'}` },
                        { name: 'Subraces', value: `${body.subraces.length ?
                            body.subraces.map(elem => elem.name).join(`\r\n`) : 'None'}` }
                    )
                break;
            case 'classes':
                infoEmbed.setTitle(`${body.name}`)
                    .addFields(
                        { name: 'Hit die', value: `${body.hit_die}` },
                        { name: 'Proficiency Choices', value: `${body.proficiency_choices
                            .map(elem => elem.desc).join(`\r\n`)}` },
                        { name: 'Proficiencies', value: `${body.proficiencies
                            .map(elem => elem.name).join(`\r\n`)}` },
                        { name: 'Saving Throws', value: `${body.saving_throws
                            .map(elem => elem.name).join(`\r\n`)}` },
                        { name: 'Starting Equipment', value: `${body.starting_equipment
                            .map(elem => `${elem.equipment.name}: ${elem.quantity}`).join(`\r\n`)}` },
                        { name: 'Starting Equipment Options', value: `${body.starting_equipment_options
                            .map(elem => `${elem.desc}`).join(`\r\n`)}` },
                        { name: 'Multi-Classing Ability Score Prerequisites', value: `${body.multi_classing.prerequisites.length ?
                            body.multi_classing.prerequisites.map(elem => `${elem.ability_score.name}: ${elem.minimum_score}`).join(`\r\n`) : 'None'}` },
                        { name: 'Multi-Classing Proficiencies', value: `${body.multi_classing.proficiencies.length ?
                            body.multi_classing.proficiencies.map(elem => elem.name).join(`\r\n`) : 'None'}` },
                        { name: 'Subclasses', value: `${body.subclasses.length ?
                            body.subclasses.map(elem => elem.name).join(`\r\n`) : 'None'}` },
                        { name: 'Spellcasting Ability', value: `${body.spellcasting ?
                            body.spellcasting.spellcasting_ability.name : 'None'}` },
                    )
                break;
            case 'spells':
                infoEmbed.setTitle(`${body.name}`)
                    .setURL(`https://5e.tools/spells.html#${interaction.options.getString('feature').replace(' ', '%20')}_phb`)
                    .addFields(
                        { name: 'Description', value: `${body.desc.join(`\r\n`).length <= 1024 ?
                            body.desc.join(`\r\n`) :
                            `Description too long - Click the title to visit the 5e.tools spells page`}` },
                        { name: 'Range', value: `${body.range}`, inline: true },
                        { name: 'Components', value: `${body.components.join(' ')}`, inline: true },
                        { name: 'Material', value: `${body.material}` },
                        { name: 'Ritual', value: `${body.ritual ? 'Yes' : 'No'}`, inline: true },
                        { name: 'Duration', value: `${body.duration}`, inline: true },
                        { name: 'Concentration', value: `${body.concentration ? 'Yes' : 'No'}`, inline: true },
                        { name: 'Casting Time', value: `${body.casting_time}`, inline: true },
                        { name: 'Level', value: `${body.level}`, inline: true },
                        { name: 'School', value: `${body.school.name}`, inline: true },
                        { name: 'Classes', value: `${body.classes.map(elem => elem.name).join(`\r\n`)}` },
                    )
                break;
            case 'features':
                infoEmbed.setTitle(`${body.name}`)
                    .setDescription(`${body.desc.join(`\r\n`)}`)
                    .addFields(
                        { name: 'Class', value: `${body.class.name}` },
                        { name: 'Subclass', value: `${body.subclass.name ?
                            body.subclass.name : 'None'}` },
                        { name: 'Level', value: `${body.level}` },
                        { name: 'Prerequisites', value: `${body.prerequisites.length ?
                            body.prerequisites.join(`\r\n`) : 'None'}` },
                    )
                break;
            case 'traits':
                infoEmbed.setTitle(`${body.name}`)
                    .setDescription(`${body.desc.join(`\r\n`)}`)
                    .addFields(
                        { name: 'Proficiencies', value: `${body.proficiencies.length ?
                            body.proficiencies.map(elem => elem.name).join(`\r\n`) : 'None'}` },
                        { name: 'Races', value: `${body.races.length ?
                            body.races.map(elem => elem.name).join(`\r\n`) : 'None'}` },
                        { name: 'Subraces', value: `${body.subraces.length ?
                            body.subraces.map(elem => elem.name).join(`\r\n`) : 'None'}` },
                    )
                break;
            case 'monsters':
                infoEmbed.setTitle(`${body.name}`)
                    .addFields(
                        { name: 'Size', value: `${body.size}`, inline: true},
                        { name: 'Type', value: `${body.type}`, inline: true },
                        { name: 'Alignment', value: `${body.alignment}`, inline: true },
                        { name: 'Armor Class', value: `${body.armor_class}` },
                        { name: 'Hit Points', value: `${body.hit_points}` },
                        { name: 'Speed', value: `${Object.keys(body.speed)
                            .map(elem => `${elem}: ${body.speed[elem]}`).join(`\r\n`)}` },
                        { name: 'STR', value: `${body.strength}`, inline: true },
                        { name: 'DEX', value: `${body.dexterity}`, inline: true },
                        { name: 'CON', value: `${body.constitution}`, inline: true },
                        { name: 'INT', value: `${body.intelligence}`, inline: true },
                        { name: 'WIS', value: `${body.wisdom}`, inline: true },
                        { name: 'CHA', value: `${body.charisma}`, inline: true },
                        { name: 'Proficiencies', value: `${body.proficiencies.length ?
                            body.proficiencies.map(elem => `${elem.proficiency.name} +${elem.value}`).join(`\r\n`) : 'None'}` },
                        { name: 'Damage Vulnerabilities', value: `${body.damage_vulnerabilities.length ?
                            body.damage_vulnerabilities.join(`\r\n`) : 'None'}`, inline: true },
                        { name: 'Damage Resistances', value: `${body.damage_resistances.length ?
                            body.damage_resistances.join(`\r\n`) : 'None'}`, inline: true },
                        { name: 'Damage Immunities', value: `${body.damage_immunities.length ?
                            body.damage_immunities.join(`\r\n`) : 'None'}`, inline: true },
                        { name: 'Condition Immunities', value: `${body.condition_immunities.length ?
                            body.condition_immunities.map(elem => `${elem.name}`).join(`\r\n`) : 'None'}` },
                        { name: 'Senses', value: `${body.senses ? Object.keys(body.senses)
                            .map(elem => `${elem}: ${body.senses[elem]}`).join(`\r\n`) : 'None'}` },
                        { name: 'Languages', value: `${body.languages ? body.languages : 'None'}` },
                        { name: 'Challenge Rating', value: `${body.challenge_rating}`, inline: true },
                        { name: 'XP', value: `${body.xp}`, inline: true },
                        { name: 'Special Abilities', value: `${body.special_abilities.length ?
                            body.special_abilities.map(elem => `**${elem.name}:** ${elem.desc}`).join(`\r\n`) : 'None'}` },
                        { name: 'Actions', value: `${body.actions.length ?
                            body.actions.slice(0, Math.ceil(body.actions.length / 2))
                            .map(elem => `**${elem.name}:** ${elem.desc}`).join(`\r\n`) : 'None'}` },
                        { name: 'Additional Actions', value: `${body.actions.length > 1 ?
                            body.actions.slice(Math.ceil(body.actions.length / 2))
                            .map(elem => `**${elem.name}:** ${elem.desc}`).join(`\r\n`) : 'None'}` },
                        { name: 'Legendary Actions', value: `${body.legendary_actions.length ?
                            body.legendary_actions.map(elem => `**${elem.name}:** ${elem.desc}`).join(`\r\n`) : 'None'}` },
                    )
                break;
        }

        await interaction.reply({ embeds: [infoEmbed] })
	},
};

async function getJSONResponse(body) {
	let fullBody = '';

	for await (const data of body) {
		fullBody += data.toString();
	}

	return JSON.parse(fullBody);
}

function capitalize(word) {
    return word[0].toUpperCase() + word.slice(1).toLowerCase();
}