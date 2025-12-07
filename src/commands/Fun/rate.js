const {
    EmbedBuilder,
    ApplicationCommandType,
    ApplicationCommandOptionType
} = require("discord.js");
const response = require("../../functions/response");
const error = require("../../functions/error");

module.exports = {
    name: "rate",
    description: "Rate users on various fun scales!",
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
        name: "type",
        description: "What do you want to rate?",
        type: ApplicationCommandOptionType.String,
        required: true,
        choices: [
            { name: "How rizzy (cool) a user is", value: "rizzy" },
            { name: "How gay a user is", value: "gay" },
            { name: "How simp a user is", value: "simp" },
            { name: "How horny a user is", value: "horny" },
            { name: "How based a user is", value: "based" },
            { name: "How cringe a user is", value: "cringe" },
            { name: "How sigma a user is", value: "sigma" }
        ]
    }, {
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
            const ratingType = interaction.options.getString("type");
            const targetUser = interaction.options.getUser("user") || interaction.user;
            const member = interaction.guild.members.cache.get(targetUser.id);

            // Generate a seeded random number based on user ID for consistent ratings
            const seed = targetUser.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
            const rating = Math.floor((seed * 9301) % 101); // 0-100

            let title = "";
            let description = "";
            let color = "";
            let emoji = "";

            switch (ratingType) {
                case "rizzy":
                    title = `How Rizzy is ${targetUser.username}?`;
                    description = getRizzyMessage(rating);
                    color = rating > 70 ? "Green" : rating > 40 ? "Yellow" : "Red";
                    emoji = rating > 70 ? "💯" : rating > 40 ? "👍" : "👎";
                    break;

                case "gay":
                    title = `How Gay is ${targetUser.username}?`;
                    description = getGayMessage(rating);
                    color = rating > 80 ? "Purple" : rating > 50 ? "Blue" : "Orange";
                    emoji = "🏳️‍🌈";
                    break;

                case "simp":
                    title = `How Much of a Simp is ${targetUser.username}?`;
                    description = getSimpMessage(rating);
                    color = rating > 70 ? "Red" : rating > 40 ? "Pink" : "Green";
                    emoji = rating > 70 ? "🥺" : rating > 40 ? "😳" : "😎";
                    break;

                case "horny":
                    title = `How Horny is ${targetUser.username}?`;
                    description = getHornyMessage(rating);
                    color = rating > 80 ? "Red" : rating > 50 ? "Pink" : "Blue";
                    emoji = rating > 70 ? "😈" : rating > 40 ? "🥵" : "😴";
                    break;

                case "based":
                    title = `How Based is ${targetUser.username}?`;
                    description = getBasedMessage(rating);
                    color = rating > 70 ? "Green" : rating > 40 ? "Yellow" : "Red";
                    emoji = rating > 70 ? "🤝" : rating > 40 ? "👌" : "🤡";
                    break;

                case "cringe":
                    title = `How Cringe is ${targetUser.username}?`;
                    description = getCringeMessage(rating);
                    color = rating > 70 ? "Red" : rating > 40 ? "Orange" : "Green";
                    emoji = rating > 70 ? "🤮" : rating > 40 ? "😬" : "😎";
                    break;

                case "sigma":
                    title = `How Sigma is ${targetUser.username}?`;
                    description = getSigmaMessage(rating);
                    color = rating > 70 ? "Gold" : rating > 40 ? "Silver" : "Grey";
                    emoji = rating > 70 ? "🧢" : rating > 40 ? "👑" : "🧢";
                    break;
            }

            const embed = new EmbedBuilder()
                .setColor(color)
                .setTitle(`${emoji} ${title}`)
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

// Helper functions for rating messages
function getRizzyMessage(rating) {
    if (rating >= 90) return "Absolutely Rizzler! Sigma male vibes! 💯";
    if (rating >= 80) return "Major rizz! Could charm anyone! 🔥";
    if (rating >= 70) return "Solid rizz game! 🤑";
    if (rating >= 60) return "Decent rizz, keeps trying! 📈";
    if (rating >= 50) return "Average rizz, room for improvement! 🤷‍♂️";
    if (rating >= 40) return "Rizz needs work! 📚";
    if (rating >= 30) return "Low rizz energy! 😴";
    if (rating >= 20) return "Rizzless! 💀";
    if (rating >= 10) return "Negative rizz! 🤡";
    return "Rizz so low it's in the negatives! 🚫";
}

function getGayMessage(rating) {
    if (rating >= 90) return "Rainbow flag emoji incarnate! 🏳️‍🌈";
    if (rating >= 80) return "Very gay! Slays the house down! 💅";
    if (rating >= 70) return "Pretty gay! ✨";
    if (rating >= 60) return "Above average gayness! 🌈";
    if (rating >= 50) return "Moderately gay! 🤷‍♂️";
    if (rating >= 40) return "Questioning... 🤔";
    if (rating >= 30) return "Straight-passing! 😎";
    if (rating >= 20) return "Mostly straight! 👨";
    if (rating >= 10) return "Very straight! 🚫";
    return "So straight, might as well be a ruler! 📏";
}

function getSimpMessage(rating) {
    if (rating >= 90) return "Ultimate simp! Would die for crush! 🥺";
    if (rating >= 80) return "Certified simp! 💍";
    if (rating >= 70) return "Major simp energy! 😍";
    if (rating >= 60) return "Simping hard! 💕";
    if (rating >= 50) return "Moderate simping! 🤔";
    if (rating >= 40) return "Light simping! 💭";
    if (rating >= 30) return "Barely simping! 😐";
    if (rating >= 20) return "Not really simping! 🙅‍♂️";
    if (rating >= 10) return "Anti-simp! 😤";
    return "Sigma grindset! No simping here! 💪";
}

function getHornyMessage(rating) {
    if (rating >= 90) return "Absolutely feral! 🥵🔥";
    if (rating >= 80) return "Very horny! Can't control it! 😈";
    if (rating >= 70) return "Majorly horny! 💥";
    if (rating >= 60) return "Quite horny! 🥵";
    if (rating >= 50) return "Moderately horny! 😏";
    if (rating >= 40) return "Somewhat horny! 🤔";
    if (rating >= 30) return "Mildly horny! 😐";
    if (rating >= 20) return "Not very horny! 😴";
    if (rating >= 10) return "Barely horny! 🙄";
    return "Asexual vibes! No horny energy! 🚫";
}

function getBasedMessage(rating) {
    if (rating >= 90) return "Maximum based! Redpilled! 🤝";
    if (rating >= 80) return "Very based! 💯";
    if (rating >= 70) return "Highly based! 🧢";
    if (rating >= 60) return "Quite based! 👍";
    if (rating >= 50) return "Moderately based! 🤔";
    if (rating >= 40) return "Somewhat based! 😐";
    if (rating >= 30) return "Lightly based! 🙄";
    if (rating >= 20) return "Barely based! 👎";
    if (rating >= 10) return "Not based! 🤡";
    return "Cringe and bluepilled! 🚫";
}

function getCringeMessage(rating) {
    if (rating >= 90) return "Maximum cringe! Can't look away! 🤮";
    if (rating >= 80) return "Extremely cringe! 😬";
    if (rating >= 70) return "Very cringe! 🤢";
    if (rating >= 60) return "Quite cringe! 😖";
    if (rating >= 50) return "Moderately cringe! 🤔";
    if (rating >= 40) return "Somewhat cringe! 😐";
    if (rating >= 30) return "Lightly cringe! 🙄";
    if (rating >= 20) return "Barely cringe! 👍";
    if (rating >= 10) return "Not cringe! 😎";
    return "Zero cringe! Based and redpilled! 🤝";
}

function getSigmaMessage(rating) {
    if (rating >= 90) return "True sigma male! Lone wolf! 🐺";
    if (rating >= 80) return "Sigma grindset! 💪";
    if (rating >= 70) return "High sigma energy! 🧢";
    if (rating >= 60) return "Quite sigma! 👑";
    if (rating >= 50) return "Moderately sigma! 🤔";
    if (rating >= 40) return "Somewhat sigma! 😐";
    if (rating >= 30) return "Light sigma tendencies! 🙄";
    if (rating >= 20) return "Barely sigma! 👎";
    if (rating >= 10) return "Not sigma! 🤡";
    return "Beta cuck energy! 🚫";
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
