const {
    EmbedBuilder,
    ApplicationCommandType,
    ApplicationCommandOptionType
} = require("discord.js");
const eightball = require("../../storage/eightBall.json");
const copyRight = require("../../storage/copyRight.json");
const error = require("../../functions/error");
module.exports = {
    name: "8ball",
    description: "Ask the magic 8-ball any question!",
    category: "fun",
    type: ApplicationCommandType.ChatInput,
    cooldown: 5,
    user_permissions: ["SendMessages"],
    bot_permissions: ["SendMessages", "EmbedLinks"],
    dm_permissions: false,
    only_owner: false,
    only_slash: true,
    only_message: false,
    options: [{
        name: "question",
        description: "Ask your question to the magic 8-ball",
        type: ApplicationCommandOptionType.String,
        required: true
    }],

    /**
     * 
     * @param {import("discord.js").Client} client 
     * @param {import("discord.js").CommandInteraction} interaction 
     * @param {Array<string>} args 
     * @returns 
     */
    run: async (client, interaction, args) => {
        try {
            const question = interaction.options.getString("question");
            await interaction.deferReply({ ephemeral: false });
            const answer = eightball[Math.floor(Math.random() * Math.floor(eightball.length))];
            return await interaction.editReply({
                embeds: [new EmbedBuilder().setColor("Blue").setAuthor({ name: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) }).setTitle(`🎱| 8ball`).addFields({ name: "Question:", value: question }, { name: "Answer:", value: answer }).setFooter({ text: `${copyRight.footerText}`, iconURL: copyRight.footerIcon })]
            });
        } catch (e) {
            error(e);
        }
    }
}
/**
 * @copyright
 * Coded by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * @copyright
 * Work for Persian Caesar | https://dsc.gg/persian-caesar
 * @copyright
 * Please Mention Us "Persian Caesar", When Have Problem With Using This Code!
 * @copyright
*/