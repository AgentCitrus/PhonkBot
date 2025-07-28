import { SlashCommandBuilder } from 'discord.js';
import { Innertube, UniversalCache, Utils } from 'youtubei.js';

export const data = new SlashCommandBuilder()
    .setName('getvideoinfo')
    .setDescription('Get information about a YouTube video')
    .addStringOption(option => option.setName('video')
        .setDescription('The video to get information of (ID or URL).')
        .setRequired(true));
export async function execute(interaction) {
    const yt = await Innertube.create();

    let videoId = interaction.options.getString('video').slice(-11);
    let videoInfo = await yt.getBasicInfo(videoId);
    console.log(videoInfo);
    interaction.reply(`test: ${videoInfo}`);
}