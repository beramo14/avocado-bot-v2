const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const ytdl = require('ytdl-core');
const Music = require('../../model/Music');
const { VoiceConnectionStatus , joinVoiceChannel, createAudioResource, createAudioPlayer, AudioPlayerStatus, StreamType, getVoiceConnection } = require('@discordjs/voice');
const logger = require('../../config/logger');

const musicQueueArray = [];
const ytdlOptions = {"filter" : "audioonly", "quality" : "highestaudio", "highWaterMark" : 32768};
global.isNowPlaying = false;
global.tempPlayer = null;
let autoMusicStop = null;

module.exports = {
    cooldown: 5,
	data: new SlashCommandBuilder()
        .setName('재생')
        .setDescription('음악을 재생하거나 큐에 등록합니다.')
        .addStringOption(option => option.setName('영상').setDescription('유튜브 영상ID 또는 영상의 URL을 입력합니다.').setRequired(true)),
	async execute(interaction) {

        let videoID_or_URL = interaction.options.getString("영상");

        let music = new Music();

        if(ytdl.validateID(videoID_or_URL)) {
            music.setVideoId(videoID_or_URL);
        } else if(ytdl.validateURL(videoID_or_URL)) {
            music.setVideoId(ytdl.getURLVideoID(videoID_or_URL));
        } else {
            await interaction.reply({content:"ID 및 URL을 확인 후 다시 시도해주세요."});
            return;
        }

        let {videoDetails} = await ytdl.getBasicInfo(music.videoId);

        music.setUrl(videoDetails.video_url)
            .setTitle(videoDetails.title)
            .setAuthor(videoDetails.author.name)
            .setThumbnail(videoDetails.thumbnails[1])
            .setRequestMember(interaction.member);

        if(autoMusicStop != null) {
            clearTimeout(autoMusicStop);
        }

        if(global.isNowPlaying == false) {
            await interaction.reply({embeds : [music.queueAddedMessageEmbed()]})
            musicQueueArray.push(music);
            let connection = joinVoiceChannel({
                guildId: interaction.guildId,
                channelId: interaction.member.voice.channel.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });
            
            musicPlay(interaction, connection);
        } else {
            musicQueueArray.push(music);
            await interaction.reply({embeds : [music.queueAddedMessageEmbed()]})
        }
        
	},
};

async function musicPlay(interaction, connection) {
    logger.info(`musicQueueArray.length : ${musicQueueArray.length}`);
    if(musicQueueArray.length == 0) {
        musicStop(interaction.guildId);
        return;
    }
    global.isNowPlaying = true;

    let currentMusic = musicQueueArray.shift();

    interaction.channel.send({embeds : [currentMusic.nowPlayingMessageEmbed()]});

    let player = createAudioPlayer();
    global.tempPlayer = player;
    connection.subscribe(player);

    player.play(createAudioResource(ytdl(currentMusic.url, ytdlOptions)));

    player.on('error', error => {
        logger.error(`Error: ${error.message}, with track: ${error}`);
        console.log(error);
    });

    player.on(AudioPlayerStatus.Playing, () => {
        logger.info(`${currentMusic.title} : The audio player has started playing!`);
    });
    player.on(AudioPlayerStatus.Idle, () => {
        logger.info('The audio player has started Idle!');
        player.stop();
        global.tempPlayer = null;
        global.isNowPlaying = false;
        musicPlay(interaction, connection);
    });
    player.on(AudioPlayerStatus.Paused, () => {
        logger.info('The audio player has started Paused!');
    });
    player.on(AudioPlayerStatus.AutoPaused, () => {
        logger.info('The audio player has started AutoPaused!');
    });
}

function musicStop(guildId) {
    autoMusicStop = setTimeout(()=>{
        logger.info("Auto Music Stop...");
        const connection = getVoiceConnection(guildId);
        global.isNowPlaying = false;
        global.tempPlayer = null;
        if(connection != null) {
            connection.disconnect();
            connection.destroy();
        }
    }, 1000 * 60 * 5);
}