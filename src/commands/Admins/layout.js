const {
    EmbedBuilder,
    ChannelType,
    ApplicationCommandType,
    ApplicationCommandOptionType
} = require("discord.js");
const error = require("../../functions/error");
const { getRandomLayout, layouts, layoutCategories } = require("../../functions/layouts");
const { buildTextUrl, trimDiscordText } = require("../../functions/aiCommands");

const SUPPORTED_RESTORE_CHANNELS = [ChannelType.GuildText, ChannelType.GuildVoice];

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

function getLayoutBackupKey(guildId) {
    return `layoutBackup.${guildId}`;
}

function buildCurrentLayoutSnapshot(guild) {
    const categories = guild.channels.cache
        .filter((channel) => channel.type === ChannelType.GuildCategory)
        .sort((a, b) => a.rawPosition - b.rawPosition)
        .map((category) => ({
            name: category.name,
            channels: guild.channels.cache
                .filter((channel) => channel.parentId === category.id && SUPPORTED_RESTORE_CHANNELS.includes(channel.type))
                .sort((a, b) => a.rawPosition - b.rawPosition)
                .map((channel) => ({
                    name: channel.name,
                    type: channel.type
                }))
        }));

    const uncategorizedChannels = guild.channels.cache
        .filter((channel) => !channel.parentId && SUPPORTED_RESTORE_CHANNELS.includes(channel.type))
        .sort((a, b) => a.rawPosition - b.rawPosition)
        .map((channel) => ({
            name: channel.name,
            type: channel.type
        }));

    if (uncategorizedChannels.length) {
        categories.push({
            name: "restored-uncategorized",
            channels: uncategorizedChannels
        });
    }

    return {
        savedAt: Date.now(),
        categories
    };
}

async function createLayout(interaction, layout) {
    const created = [];

    for (const category of layout.categories) {
        const categoryChannel = await interaction.guild.channels.create({
            name: category.name,
            type: ChannelType.GuildCategory,
            reason: `Applied layout by ${interaction.user.tag}`
        });
        created.push(categoryChannel.toString());

        for (const channel of category.channels) {
            const createdChannel = await interaction.guild.channels.create({
                name: channel.name,
                type: channel.type,
                parent: categoryChannel.id,
                reason: `Applied layout by ${interaction.user.tag}`
            });
            created.push(createdChannel.toString());
        }
    }

    return created;
}

function buildPreviewEmbed(layout, aiTip) {
    return new EmbedBuilder()
        .setColor("Blue")
        .setTitle(`Preview: ${layout.name}`)
        .setDescription(layout.description)
        .addFields(
            { name: "Layout", value: `Random layout **${layout.id}** of **${layouts.length}**.` },
            { name: "AI-powered info", value: aiTip },
            { name: "Categories and channels", value: trimDiscordText(formatLayout(layout), 1000) }
        )
        .setFooter({ text: "Use /layout apply, /layout <category> mode:Apply, /layout save, or /layout restore." })
        .setTimestamp();
}

module.exports = {
    name: "layout",
    description: "Preview, apply, save, or restore AI-powered server layouts.",
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
    options: [
        {
            name: "preview",
            description: "Preview one random AI-powered server layout from all categories.",
            type: ApplicationCommandOptionType.Subcommand
        },
        {
            name: "apply",
            description: "Create categories and channels from one random AI-powered layout.",
            type: ApplicationCommandOptionType.Subcommand
        },
        ...layoutCategories.map((category) => ({
            name: category,
            description: `Preview or apply a random ${category} layout.`,
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: "mode",
                description: "Preview the layout or apply it to the server.",
                type: ApplicationCommandOptionType.String,
                required: false,
                choices: [{
                    name: "Preview",
                    value: "preview"
                }, {
                    name: "Apply",
                    value: "apply"
                }]
            }]
        })),
        {
            name: "save",
            description: "Save the current server category and channel layout for later restore.",
            type: ApplicationCommandOptionType.Subcommand
        },
        {
            name: "restore",
            description: "Restore the saved category and channel layout without deleting existing channels.",
            type: ApplicationCommandOptionType.Subcommand
        }
    ],

    run: async (client, interaction) => {
        try {
            const subcommand = interaction.options.getSubcommand() || "preview";
            const categoryMode = layoutCategories.includes(subcommand) ? interaction.options.getString("mode") || "preview" : null;
            const shouldApply = subcommand === "apply" || categoryMode === "apply";
            await interaction.deferReply({ ephemeral: !shouldApply });

            if (subcommand === "save") {
                const snapshot = buildCurrentLayoutSnapshot(interaction.guild);
                await client.db.set(getLayoutBackupKey(interaction.guild.id), snapshot);

                const totalChannels = snapshot.categories.reduce((total, category) => total + category.channels.length, 0);
                const embed = new EmbedBuilder()
                    .setColor("Green")
                    .setTitle("Server layout saved")
                    .setDescription("Your current category and channel layout has been saved for `/layout restore`.")
                    .addFields(
                        { name: "Saved categories", value: `${snapshot.categories.length}`, inline: true },
                        { name: "Saved channels", value: `${totalChannels}`, inline: true }
                    )
                    .setTimestamp();

                return await interaction.editReply({ embeds: [embed] });
            }

            if (subcommand === "restore") {
                const snapshot = await client.db.get(getLayoutBackupKey(interaction.guild.id));
                if (!snapshot?.categories?.length) {
                    return await interaction.editReply({ content: "No saved layout was found. Run `/layout save` first." });
                }

                const created = await createLayout(interaction, snapshot);
                const embed = new EmbedBuilder()
                    .setColor("Green")
                    .setTitle("Server layout restored")
                    .setDescription("Your saved layout was restored by creating new categories and channels. Existing channels were not deleted.")
                    .addFields(
                        { name: "Saved at", value: `<t:${Math.floor(snapshot.savedAt / 1000)}:F>` },
                        { name: "Created", value: trimDiscordText(created.join("\n"), 1000) }
                    )
                    .setTimestamp();

                return await interaction.editReply({ embeds: [embed] });
            }

            const selectedCategory = layoutCategories.includes(subcommand) ? subcommand : null;
            const layout = getRandomLayout(selectedCategory);
            const aiTip = await getAiLayoutTip(layout);

            if (shouldApply) {
                const created = await createLayout(interaction, layout);
                const embed = buildPreviewEmbed(layout, aiTip)
                    .setColor("Green")
                    .setTitle(`Applied: ${layout.name}`)
                    .setFooter({ text: "Created new categories and channels. Existing channels were not deleted." })
                    .addFields({ name: "Created", value: trimDiscordText(created.join("\n"), 1000) });

                return await interaction.editReply({ embeds: [embed] });
            }

            return await interaction.editReply({ embeds: [buildPreviewEmbed(layout, aiTip)] });
        } catch (e) {
            error(e);
            if (interaction.deferred || interaction.replied) {
                return await interaction.editReply({ content: "Something went wrong while building the server layout." });
            }
            return await interaction.reply({ content: "Something went wrong while building the server layout.", ephemeral: true });
        }
    }
};
