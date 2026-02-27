const {
    EmbedBuilder,
    ApplicationCommandType
} = require("discord.js");
const response = require("../../functions/response");
const error = require("../../functions/error");

module.exports = {
    name: "Report Message",
    description: "Report a message to moderators",
    category: "admin",
    type: ApplicationCommandType.Message,
    cooldown: 30,
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
            const reportedMessage = interaction.targetMessage;
            const reportedUser = reportedMessage.author;

            // Create a report embed
            const reportEmbed = new EmbedBuilder()
                .setColor("Red")
                .setTitle("🚨 Message Report")
                .setDescription(`A message has been reported for review.`)
                .addFields([
                    {
                        name: "Reported User",
                        value: `${reportedUser.tag} (${reportedUser.id})`,
                        inline: true
                    },
                    {
                        name: "Reported By",
                        value: `${interaction.user.tag} (${interaction.user.id})`,
                        inline: true
                    },
                    {
                        name: "Channel",
                        value: `${interaction.channel.name} (${interaction.channel.id})`,
                        inline: true
                    },
                    {
                        name: "Message Content",
                        value: reportedMessage.content || "*No text content*",
                        inline: false
                    },
                    {
                        name: "Message Link",
                        value: `[Jump to Message](${reportedMessage.url})`,
                        inline: true
                    },
                    {
                        name: "Timestamp",
                        value: `<t:${Math.floor(reportedMessage.createdTimestamp / 1000)}:F>`,
                        inline: true
                    }
                ])
                .setThumbnail(reportedUser.displayAvatarURL({ dynamic: true }))
                .setTimestamp();

            // Try to send to a mod log channel if it exists
            const modChannel = interaction.guild.channels.cache.find(
                channel => channel.name.includes('mod') ||
                          channel.name.includes('log') ||
                          channel.name.includes('report')
            );

            if (modChannel && modChannel.permissionsFor(client.user).has(['SendMessages', 'EmbedLinks'])) {
                await modChannel.send({ embeds: [reportEmbed] });
                return await response(interaction, {
                    content: "✅ Message reported to moderators!",
                    ephemeral: true
                });
            } else {
                // Fallback: send to current channel
                return await response(interaction, {
                    embeds: [reportEmbed],
                    ephemeral: false
                });
            }
        } catch (e) {
            error(e);
            return await response(interaction, {
                content: "❌ Failed to report message. Please try again.",
                ephemeral: true
            });
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
