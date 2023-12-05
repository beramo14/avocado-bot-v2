const { getVoiceConnection } = require("@discordjs/voice");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    cooldown: 5,
	data: new SlashCommandBuilder()
        .setName('정지')
        .setDescription('음악을 정지합니다.'),
	async execute(interaction) {
        const connection = getVoiceConnection(interaction.guildId);
        global.isNowPlaying = false;
        global.tempPlayer = null;
        if(connection != null) {
            connection.disconnect();
            connection.destroy();
            await interaction.reply({content:"음악을 정지합니다."});
        } else {
            await interaction.reply({content:"음악을 정지합니다."});
        }
        return;
    },
}

//guildId: interaction.guildId,