const {
    EmbedBuilder,
    ApplicationCommandType,
    ApplicationCommandOptionType
} = require("discord.js");
const response = require("../../functions/response");
const error = require("../../functions/error");

module.exports = {
    name: "rate-gay",
    description: "Rate how gay a user is! 🏳️‍🌈",
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
            let emoji = "🏳️‍🌈";

            if (rating >= 90) {
                description = "RAINBOW FLAG INCARNATE! Ultimate gay icon! 💅✨🦄";
                color = "Purple";
            } else if (rating >= 80) {
                description = "Super gay! Slays harder than RuPaul! 💃🎤";
                color = "Purple";
            } else if (rating >= 70) {
                description = "Very gay! Could be on Drag Race! 👑";
                color = "Blue";
            } else if (rating >= 60) {
                description = "Pretty gay! Has fabulous taste! ✨";
                color = "Blue";
            } else if (rating >= 50) {
                description = "Above average gayness! 🌈";
                color = "Green";
            } else if (rating >= 40) {
                description = "Moderately gay! 🤔";
                color = "Yellow";
            } else if (rating >= 30) {
                description = "Questioning... Maybe bi-curious? 🤷‍♂️";
                color = "Orange";
            } else if (rating >= 20) {
                description = "Straight-passing gay! Closeted vibes! 😎";
                color = "Orange";
            } else if (rating >= 10) {
                description = "Mostly straight with gay tendencies! 👨";
                color = "Red";
            } else {
                description = "SO STRAIGHT, MIGHT AS WELL BE A RULER! 📏";
                color = "DarkRed";
            }

            const embed = new EmbedBuilder()
                .setColor(color)
                .setTitle(`${emoji} How Gay is ${targetUser.username}?`)
                .setDescription(`${targetUser}\n\n**${rating}%** - ${description}`)
                .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
                .setFooter({
                    text: `Gay rated by ${interaction.user.username}`,
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
