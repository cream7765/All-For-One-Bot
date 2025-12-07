const {
    EmbedBuilder,
    ApplicationCommandType,
    ApplicationCommandOptionType
} = require("discord.js");
const response = require("../../functions/response");
const error = require("../../functions/error");

module.exports = {
    name: "penis",
    description: "Measure a user's penis size! 🍆",
    category: "fun",
    type: ApplicationCommandType.ChatInput,
    cooldown: 10,
    user_permissions: ["SendMessages"],
    bot_permissions: ["SendMessages", "EmbedLinks"],
    dm_permissions: false,
    only_owner: false,
    only_slash: true,
    only_message: false,
    options: [{
        name: "user",
        description: "The user to measure (optional - measures yourself if not specified)",
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

            // Generate a seeded random size based on user ID for consistent results
            const seed = targetUser.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
            const sizeInches = ((seed * 9301) % 120) / 10; // 0-12 inches
            const sizeCm = Math.round(sizeInches * 2.54); // Convert to cm

            // Create the penis visualization
            const penisLength = Math.floor(sizeInches);
            let penisBar = "8";

            // Add = for each inch
            for (let i = 0; i < penisLength; i++) {
                penisBar += "=";
            }
            penisBar += "D";

            let title = "";
            let description = "";
            let color = "";
            let emoji = "🍆";

            if (sizeInches >= 10) {
                title = `Holy shit! ${targetUser.username}'s penis size:`;
                description = "MONSTER MODE! 🐍";
                color = "Gold";
            } else if (sizeInches >= 8) {
                title = `Damn! ${targetUser.username}'s penis size:`;
                description = "Impressive! 💪";
                color = "Green";
            } else if (sizeInches >= 6) {
                title = `${targetUser.username}'s penis size:`;
                description = "Above average! 👍";
                color = "Blue";
            } else if (sizeInches >= 4) {
                title = `${targetUser.username}'s penis size:`;
                description = "Average! 🤷‍♂️";
                color = "Yellow";
            } else if (sizeInches >= 2) {
                title = `${targetUser.username}'s penis size:`;
                description = "Below average! 😅";
                color = "Orange";
            } else {
                title = `${targetUser.username}'s penis size:`;
                description = "Tiny! 🤏";
                color = "Red";
            }

            const embed = new EmbedBuilder()
                .setColor(color)
                .setTitle(`${emoji} ${title}`)
                .setDescription(`${targetUser}\n\n**${sizeInches.toFixed(1)} inches** (${sizeCm} cm)\n\`\`\`\n${penisBar}\n\`\`\`\n${description}`)
                .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
                .setFooter({
                    text: `Measured by ${interaction.user.username}`,
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
