const { createAudioPlayer, NoSubscriberBehavior, joinVoiceChannel, createAudioResource, AudioPlayerStatus, getVoiceConnection } = require('@discordjs/voice');
const { SlashCommandBuilder } = require('discord.js');
const voice = require('@discordjs/voice')
const fs = require('fs');
const ytdl = require('@distube/ytdl-core');
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

        if (!ytdl.validateID(videoId)) {
            await interaction.reply('Please enter a valid URL or video ID.');
            return;
        }

        connection = joinVoiceChannel({
            channelId: interaction.member.voice.channel.id,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator
        });

        stream = ytdl(`https://youtu.be/${videoId}`, {
            quality: 'highestaudio',
            highWaterMark: 1 << 25
        });

        if (!servObj.queue.length) {

            global.player = createAudioPlayer();

            await client.on('voiceStateUpdate', (oldState, newState) => {
                if (!(oldState.channel === null) && oldState.channel.members.size == 1) {
                    let servObj = serverData.filter(data => data.server == interaction.guild.id).at(0);
                    servObj.queue = [];

                    file.set("serverData", serverData.map(obj => (servObj.server == obj.server ? servObj : obj)));
                    file.save();
                    
                    voice.getVoiceConnection(servObj.server).disconnect();
                    player.stop();

                    return;
                }
            });

            await player.on('error', () => {
                console.trace()
            })

            await player.on(AudioPlayerStatus.Idle, () => {
                let servObj = serverData.filter(data => data.server == interaction.guild.id).at(0);
                if (servObj.loop === 'on') {
                    servObj.queue.push(servObj.queue[0]);
                }
                servObj.queue.shift()
                if (!servObj.queue.length) {
                    interaction.channel.send('**Queue finished**');
                } else {
                    stream = ytdl(`${servObj.queue[0]}`, {
                        quality: 'highestaudio',
                        highWaterMark: 1 << 25
                    });
                    player.play(createAudioResource(stream));
                }
            });

            servObj.queue.push(`https://youtu.be/${videoId}`);
            await player.play(createAudioResource(stream));
            await connection.subscribe(player);
            await interaction.reply(`**Now playing:** https://youtu.be/${videoId}`);
        } else {
            servObj.queue.push(`https://youtu.be/${videoId}`);
            await interaction.reply(`**Added video to queue:** https://youtu.be/${videoId}`);
        }

        file.set("serverData", serverData.map(obj => (servObj.server == obj.server ? servObj : obj)));
        file.save();
	},
};
