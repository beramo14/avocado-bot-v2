const { SlashCommandBuilder } = require('discord.js');
const logger = require('../../config/logger');

module.exports = {
        cooldown: 3,
        data: new SlashCommandBuilder()
                .setName('주사위')
                .setDescription('주사위를 던집니다.')
                .addIntegerOption(option => option.setName("개수").setDescription("던질 주사위 개수")),
        async execute(interaction) { 
                let dicePcs = interaction.options.getInteger("개수");
                logger.info("[Command] Call......주사위");

                dicePcs = (dicePcs)? dicePcs:1;

                /**
                 * interaction.member.user.username : NOT_Ramo
                 * interaction.member.user.discriminator : 7230(앞에 #생략)
                 * interaction.member.nickname : 라모아님(서버별명)
                 */
                //NOT_Ramo#2935[진짜아님]
                //console.log(interaction.member.user.username + "#" + interaction.member.user.discriminator+"["+interaction.member.nickname+"]");
                // logger.info(interaction);
                // console.log(interaction.member.guild);
                let result = "";
                for(let i=1; i<=dicePcs; i++) {
                        let diceNumber = Math.floor(6 * Math.random()) + 1;
                        result += getDiceEmoji(interaction.member.guild, diceNumber)+" ";
                }

                await interaction.reply(result);
        },
};

function getDiceEmoji(guild, num) {
        let emojiName = "d"+num;
        let diceEmoji = guild.emojis.cache.find(emoji => emoji.name === emojiName);
        return "<:"+emojiName+":"+diceEmoji+">";
}