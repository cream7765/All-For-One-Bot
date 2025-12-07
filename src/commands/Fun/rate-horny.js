const {
    EmbedBuilder,
    ApplicationCommandType,
    ApplicationCommandOptionType
} = require("discord.js");
const response = require("../../functions/response");
const error = require("../../functions/error");

module.exports = {
    name: "rate-horny",
    description: "Rate how horny a user is! 😈",
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
        name: "user",
        description: "The user to rate (optional - rates yourself if not specified)",
        type: ApplicationCommandOptionType.User,
        required: false
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
            const targetUser = interaction.options.getUser("user") || interaction.user;

            // Generate a seeded random rating based on user ID for consistent results
            const seed = targetUser.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
            const rating = Math.floor((seed * 9301) % 101); // 0-100

            let description = "";
            let color = "";
            let emoji = "";

            if (rating >= 90) {
                description = "ABSOLUTELY FERAL! Can't control themselves! 🥵🔥";
                color = "DarkRed";
                emoji = "😈";
            } else if (rating >= 80) {
                description = "Extremely horny! Thirst level: maximum! 🥵💦";
                color = "Red";
                emoji = "🥵";
            } else if (rating >= 70) {
                description = "Very horny! Always thinking about it! 😏";
                color = "Red";
                emoji = "😈";
            } else if (rating >= 60) {
                description = "Quite horny! Gets distracted easily! 💭";
                color = "Pink";
                emoji = "🥵";
            } else if (rating >= 50) {
                description = "Moderately horny! Normal human levels! 🤔";
                color = "Pink";
                emoji = "😏";
            } else if (rating >= 40) {
                description = "Somewhat horny! Occasionally horny! 😐";
                color = "Orange";
                emoji = "🤔";
            } else if (rating >= 30) {
                description = "Mildly horny! Keeps it in check! 🙄";
                color = "Orange";
                emoji = "😐";
            } else if (rating >= 20) {
                description = "Not very horny! Focused on other things! 😴";
                color = "Yellow";
                emoji = "😪";
            } else if (rating >= 10) {
                description = "Barely horny! Low libido! 😐";
                color = "Green";
                emoji = "😴";
            } else {
                description = "ASEXUAL VIBES! No horny energy detected! 🚫";
                color = "Blue";
                emoji = "🧊";
            }

            const embed = new EmbedBuilder()
                .setColor(color)
                .setTitle(`${emoji} How Horny is ${targetUser.username}?`)
                .setDescription(`${targetUser}\n\n**${rating}%** - ${description}`)
                .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
                .setFooter({
                    text: `Horny rated by ${interaction.user.username}`,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                })
                .setTimestamp();

            return await response(interaction, {
                embeds: [embed],
                ephemeral: false
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
