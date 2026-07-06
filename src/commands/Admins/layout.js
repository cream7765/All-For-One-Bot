const {
    EmbedBuilder,
    ChannelType,
    ApplicationCommandType,
    ApplicationCommandOptionType
} = require("discord.js");
const error = require("../../functions/error");
const { getRandomLayout, layouts } = require("../../functions/layouts");
const { buildTextUrl, trimDiscordText } = require("../../functions/aiCommands");

async function getAiLayoutTip(layout) {
    const prompt = `Write one short Discord server admin tip for this layout: ${layout.name}. Keep it under 35 words.`;

    try {
        const tip = await fetch(buildTextUrl(prompt)).then((res) => res.text());
        return trimDiscordText(tip, 250);
    } catch (e) {
        return layout.description;
    }
}

function formatLayout(layout) {
    return layout.categories.map((category) => {
        const channels = category.channels.map((channel) => {
            const icon = channel.type === ChannelType.GuildVoice ? "🔊" : "#";
            return `${icon} ${channel.name}`;
        }).join("\n");

        return `**${category.name}**\n${channels}`;
    }).join("\n\n");
}

module.exports = {
    name: "layout",
    description: "Preview or apply one of 100 random AI-powered server layouts.",
    category: "admin",
    cooldown: 30,
    type: ApplicationCommandType.ChatInput,
    user_permissions: ["ManageChannels"],
    bot_permissions: ["SendMessages", "EmbedLinks", "ManageChannels"],
    dm_permissions: false,
    only_owner: false,
    only_admin: false,
    only_slash: true,
    only_message: false,
    options: [{
        name: "mode",
        description: "Preview a layout or apply it by creating categories and channels.",
        type: ApplicationCommandOptionType.String,
        required: false,
        choices: [{
            name: "Preview",
            value: "preview"
        }, {
            name: "Apply",
            value: "apply"
        }]
    }],

    run: async (client, interaction) => {
        try {
            const mode = interaction.options.getString("mode") || "preview";
            const layout = getRandomLayout();
            await interaction.deferReply({ ephemeral: mode !== "apply" });

            const aiTip = await getAiLayoutTip(layout);
            const created = [];

            if (mode === "apply") {
                for (const category of layout.categories) {
                    const categoryChannel = await interaction.guild.channels.create({
                        name: category.name,
                        type: ChannelType.GuildCategory,
                        reason: `Applied random AI layout ${layout.id} by ${interaction.user.tag}`
                    });
                    created.push(categoryChannel.toString());

                    for (const channel of category.channels) {
                        const createdChannel = await interaction.guild.channels.create({
                            name: channel.name,
                            type: channel.type,
                            parent: categoryChannel.id,
                            reason: `Applied random AI layout ${layout.id} by ${interaction.user.tag}`
                        });
                        created.push(createdChannel.toString());
                    }
                }
            }

            const embed = new EmbedBuilder()
                .setColor(mode === "apply" ? "Green" : "Blue")
                .setTitle(`${mode === "apply" ? "Applied" : "Preview"}: ${layout.name}`)
                .setDescription(layout.description)
                .addFields(
                    { name: "Layout", value: `Random layout **${layout.id}** of **${layouts.length}**.` },
                    { name: "AI-powered info", value: aiTip },
                    { name: "Categories and channels", value: trimDiscordText(formatLayout(layout), 1000) }
                )
                .setFooter({ text: mode === "apply" ? "Created new categories and channels. Existing channels were not deleted." : "Run /layout mode:Apply to create this type of layout." })
                .setTimestamp();

            if (created.length) {
                embed.addFields({ name: "Created", value: trimDiscordText(created.join("\n"), 1000) });
            }

            return await interaction.editReply({ embeds: [embed] });
        } catch (e) {
            error(e);
            if (interaction.deferred || interaction.replied) {
                return await interaction.editReply({ content: "Something went wrong while building the server layout." });
            }
            return await interaction.reply({ content: "Something went wrong while building the server layout.", ephemeral: true });
        }
    }
};
