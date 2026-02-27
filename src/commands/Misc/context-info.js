const {
    EmbedBuilder,
    ApplicationCommandType,
    time,
    TimestampStyles
} = require("discord.js");
const response = require("../../functions/response");
const error = require("../../functions/error");

module.exports = {
    name: "Message Info",
    description: "Get detailed information about a message",
    category: "misc",
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
            const message = interaction.targetMessage;
            const author = message.author;

            const embed = new EmbedBuilder()
                .setColor("Blue")
                .setTitle("📄 Message Information")
                .setThumbnail(author.displayAvatarURL({ dynamic: true }))
                .addFields([
                    {
                        name: "👤 Author",
                        value: `${author.tag}\n${author}`,
                        inline: true
                    },
                    {
                        name: "📅 Created",
                        value: time(Math.floor(message.createdTimestamp / 1000), TimestampStyles.ShortDateTime),
                        inline: true
                    },
                    {
                        name: "🆔 Message ID",
                        value: `\`${message.id}\``,
                        inline: true
                    },
                    {
                        name: "📍 Channel",
                        value: `${message.channel.name}\n${message.channel}`,
                        inline: true
                    },
                    {
                        name: "🔗 Jump Link",
                        value: `[Click to jump](${message.url})`,
                        inline: true
                    },
                    {
                        name: "📊 Stats",
                        value: `📎 ${message.attachments.size} attachments\n🏷️ ${message.embeds.length} embeds\n📝 ${message.content.length} characters`,
                        inline: true
                    }
                ])
                .setFooter({
                    text: `Requested by ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                })
                .setTimestamp();

            // Show message content if it exists
            if (message.content) {
                embed.addFields({
                    name: "💬 Content",
                    value: message.content.length > 1024
                        ? message.content.substring(0, 1021) + "..."
                        : message.content,
                    inline: false
                });
            }

            return await response(interaction, {
                embeds: [embed],
                ephemeral: true
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
