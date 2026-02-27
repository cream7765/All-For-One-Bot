const {
    EmbedBuilder,
    ApplicationCommandType
} = require("discord.js");
const copyRight = require("../../storage/copyRight.json");
const response = require("../../functions/response");
const error = require("../../functions/error");

module.exports = {
    name: "View Profile",
    description: "View a user's economy profile",
    category: "economy",
    type: ApplicationCommandType.Message,
    cooldown: 10,
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
            const db = client.db;
            const targetUser = interaction.targetMessage.author;

            if (!await db.has(`users.${targetUser.id}`)) {
                return await response(interaction, {
                    content: `❌| ${targetUser.username} doesn't have a profile in the bot.`,
                    ephemeral: true
                });
            }

            await interaction.deferReply({ ephemeral: false });
            const profile = await db.get(`users.${targetUser.id}`);

            const embed = new EmbedBuilder()
                .setColor("Aqua")
                .setTitle("Economy | Profile")
                .setDescription(`${targetUser}'s profile found successfully.`)
                .setFooter({ text: `Economy Embed • ${copyRight.footerText}` })
                .setThumbnail(targetUser.displayAvatarURL({ forceStatic: true }))
                .addFields([{
                    name: "User:",
                    value: `${targetUser}`,
                    inline: true
                }, {
                    name: "Wallet:",
                    value: `${profile.wallet.toLocaleString()} 🪙`,
                    inline: true
                }, {
                    name: "Work Level:",
                    value: `${profile.work} Level 💼`,
                    inline: true
                }])
                .setTimestamp();

            return await interaction.editReply({
                embeds: [embed]
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
