const {
    EmbedBuilder,
    ApplicationCommandType
} = require("discord.js");
const response = require("../../functions/response");
const error = require("../../functions/error");

module.exports = {
    name: "Rate User",
    description: "Rate a user on various fun scales",
    category: "fun",
    type: ApplicationCommandType.Message,
    cooldown: 5,
    user_permissions: ["SendMessages"],
    bot_permissions: ["SendMessages", "EmbedLinks"],
    dm_permissions: false,
    only_owner: false,
    only_slash: false,
    only_message: false,

    /**
     *
     * @param {import("discord.js").Client} client
     * @param {import("discord.js").MessageContextMenuCommandInteraction} interaction
     * @param {Array} args
     * @returns
     */
    run: async (client, interaction, args) => {
        try {
            const targetUser = interaction.targetMessage.author;

            // Generate a seeded random rating based on user ID for consistent results
            const seed = targetUser.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
            const rating = Math.floor((seed * 9301) % 101); // 0-100

            // Random rating type
            const ratingTypes = [
                { name: "Rizzy", emoji: "💯", color: "Green" },
                { name: "Gay", emoji: "🏳️‍🌈", color: "Purple" },
                { name: "Horny", emoji: "😈", color: "Red" },
                { name: "Simp", emoji: "🥺", color: "Pink" },
                { name: "Based", emoji: "🤝", color: "Green" }
            ];

            const randomType = ratingTypes[Math.floor(Math.random() * ratingTypes.length)];

            let description = "";
            switch (randomType.name.toLowerCase()) {
                case "rizzy":
                    description = rating >= 70 ? "GOD TIER RIZZ! 💯" : rating >= 40 ? "Decent rizz! 📈" : "Rizz needs work! 📚";
                    break;
                case "gay":
                    description = rating >= 70 ? "Very gay! ✨" : rating >= 40 ? "Moderately gay! 🤔" : "Straight vibes! 👨";
                    break;
                case "horny":
                    description = rating >= 70 ? "Very horny! 🥵" : rating >= 40 ? "Somewhat horny! 😏" : "Not horny! 😴";
                    break;
                case "simp":
                    description = rating >= 70 ? "Ultimate simp! 🥺" : rating >= 40 ? "Light simping! 💭" : "Sigma mindset! 💪";
                    break;
                case "based":
                    description = rating >= 70 ? "Maximum based! 🤝" : rating >= 40 ? "Somewhat based! 👍" : "Cringe! 🤡";
                    break;
            }

            const embed = new EmbedBuilder()
                .setColor(randomType.color)
                .setTitle(`${randomType.emoji} How ${randomType.name} is ${targetUser.username}?`)
                .setDescription(`${targetUser}\n\n**${rating}%** - ${description}`)
                .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
                .setFooter({
                    text: `Rated by ${interaction.user.username}`,
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
