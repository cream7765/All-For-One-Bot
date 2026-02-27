const {
    EmbedBuilder,
    ApplicationCommandType,
    ApplicationCommandOptionType
} = require("discord.js");
const response = require("../../functions/response");
const error = require("../../functions/error");

module.exports = {
    name: "rate-rizzy",
    description: "Rate how rizzy (cool/charismatic) a user is!",
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
                description = "GOD TIER RIZZ! Sigma male vibes! Could charm a rock into dancing! 💯🔥";
                color = "Gold";
                emoji = "💎";
            } else if (rating >= 80) {
                description = "Absolute rizzler! Gets all the girls/guys! 🤑💯";
                color = "Green";
                emoji = "💰";
            } else if (rating >= 70) {
                description = "Major rizz! Smooth operator! 😎✨";
                color = "Blue";
                emoji = "🔥";
            } else if (rating >= 60) {
                description = "Solid rizz game! Knows how to flirt! 👍";
                color = "Blue";
                emoji = "👌";
            } else if (rating >= 50) {
                description = "Average rizz, keeps trying! 📈";
                color = "Yellow";
                emoji = "🤷‍♂️";
            } else if (rating >= 40) {
                description = "Rizz needs work! Study some pickup lines! 📚";
                color = "Orange";
                emoji = "📖";
            } else if (rating >= 30) {
                description = "Low rizz energy! Too shy! 😴";
                color = "Orange";
                emoji = "😪";
            } else if (rating >= 20) {
                description = "Rizzless! Can't talk to crush! 💀";
                color = "Red";
                emoji = "💀";
            } else if (rating >= 10) {
                description = "Negative rizz! Scares people away! 👻";
                color = "Red";
                emoji = "👎";
            } else {
                description = "RIZZ SO LOW IT'S IN THE NEGATIVES! Socially awkward! 🚫";
                color = "DarkRed";
                emoji = "🤡";
            }

            const embed = new EmbedBuilder()
                .setColor(color)
                .setTitle(`${emoji} How Rizzy is ${targetUser.username}?`)
                .setDescription(`${targetUser}\n\n**${rating}%** - ${description}`)
                .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
                .setFooter({
                    text: `Rizz rated by ${interaction.user.username}`,
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
