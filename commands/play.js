const { createAudioPlayer, NoSubscriberBehavior, joinVoiceChannel, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const ytdl = require('ytdl-core');
const ys = require('youtube-search-api');
const { serverData } = require('../config.json');
const editJsonFile = require('edit-json-file');
const path = require('path');

let file = editJsonFile(path.join(__dirname, '../config.json'));

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play a YouTube video')
        .addStringOption(option =>
            option.setName('video')
            .setDescription('The video to play (ID or URL).')
            .setRequired(true)),
	async execute(interaction) {

        let servObj = serverData.filter(data => data.server == interaction.guild.id).at(0);
        let videoId = interaction.options.getString('video').slice(-11);

	    if (!interaction.member.voice.channel) {
            await interaction.reply(`You must be in a voice channel to use this command!`);
            return;
        }

        const connection = joinVoiceChannel({
            channelId: interaction.member.voice.channel.id,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator
        });

        stream = ytdl(`https://youtu.be/${videoId}`, {
            filter: 'audioonly',
            quality: 'highestaudio',
            highWaterMark: 1 << 25
        });

        if (!servObj.queue.length) {

            global.player = createAudioPlayer({
                behaviors: {
                    noSubscriber: NoSubscriberBehavior.Stop
                }
            });

            player.on(AudioPlayerStatus.Idle, () => {
                servObj.queue.shift();
                if (!servObj.queue.length) {
                    interaction.channel.send('**Queue finished**');
                    player.stop();
                } else {
                    stream = ytdl(`${servObj.queue[0]}`, {
                        filter: 'audioonly',
                        quality: 'highestaudio',
                        highWaterMark: 1 << 25
                    });
                    player.play(createAudioResource(stream));
                    interaction.channel.send(`**Now playing:** ${servObj.queue[0]}`);
                }
            });

            servObj.queue.push(`https://youtu.be/${videoId}`);
            player.play(createAudioResource(stream));
            connection.subscribe(player);
            await interaction.reply(`**Now playing:** https://youtu.be/${videoId}`);
        } else {
            servObj.queue.push(`https://youtu.be/${videoId}`);
            await interaction.reply(`**Added video to queue:** https://youtu.be/${videoId}`);
        }

        file.set("serverData", serverData.map(obj => (servObj.server == obj.server ? servObj : obj)));
        file.save();



        /*
        if (!servObj.queue.length) {
            player.play(createAudioResource(stream));
            connection.subscribe(player);
            await interaction.reply(`**Now playing:** https://youtu.be/${videoId}`);
        } else {
            servObj.queue.push(`https://youtu.be/${interaction.options.getString('video').slice(-11)}`);
            await interaction.reply(`**${ys.GetVideoDetails(interaction.options.getString('video').slice(-11)).title}** added to queue`);
        }
        */
	},
};
