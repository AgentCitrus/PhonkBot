import { SlashCommandBuilder } from 'discord.js';
import { Innertube, UniversalCache, Utils } from 'youtubei.js';

export const data = new SlashCommandBuilder()
    .setName('searchvideo')
    .setDescription('Search for YouTube videos')
    .addStringOption(option => option.setName('term')
        .setDescription('The term to search for.')
        .setRequired(true));
export async function execute(interaction) {
    const yt = await Innertube.create({ cache: new UniversalCache(false), generate_session_locally: true });

    let term = interaction.options.getString('term');

    const search = await yt.search('Autechre', { type: 'album' });

    console.log(search.contents[0].contents);

    if (!search.results)
        throw new Error('Filter "type" must be used');

    const album = await yt.music.getAlbum(search.results[0].id);
    interaction.reply(`test: ${album}`);
}