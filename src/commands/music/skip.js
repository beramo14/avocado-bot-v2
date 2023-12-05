const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    cooldown: 5,
	data: new SlashCommandBuilder()
        .setName('스킵')
        .setDescription('현재 음악을 스킵합니다.'),
	async execute(interaction) {
        if(global.tempPlayer == null) {
            interaction.reply("이미 정지상태입니다.");
        } else {
            global.tempPlayer.stop(true);
            interaction.reply("현재 음악을 스킵합니다.");
        }
    },
}