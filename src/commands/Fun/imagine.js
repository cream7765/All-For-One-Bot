const {
    getPrompt,
    sendThinking,
    sendFinal,
    buildImageUrl,
    EmbedBuilder,
    ApplicationCommandType,
    ApplicationCommandOptionType,
    error
} = require("../../functions/aiCommands");

module.exports = {
    name: "imagine",
    aliases: ["image", "img", "generateimage"],
    description: "Generate an AI image from a text prompt.",
    category: "fun",
    cooldown: 10,
    type: ApplicationCommandType.ChatInput,
    user_permissions: ["SendMessages"],
    bot_permissions: ["SendMessages", "EmbedLinks"],
    dm_permissions: false,
    only_owner: false,
    only_slash: true,
    only_message: true,
    options: [{
        name: "prompt",
        type: ApplicationCommandOptionType.String,
        description: "Describe the image you want to generate.",
        required: true
    }],

    run: async (client, interaction, args) => {
        try {
            const prompt = getPrompt(interaction, args);
            if (!prompt) return await interaction.reply({ content: "Please provide an image prompt." });

            const thinkingMessage = await sendThinking(interaction, "🎨 Generating your image...");
            const imageUrl = buildImageUrl(prompt);
            const embed = new EmbedBuilder()
                .setColor("Purple")
                .setTitle("AI Image Generated")
                .setDescription(prompt)
                .setImage(imageUrl)
                .setTimestamp();

            return await sendFinal(interaction, { content: "", embeds: [embed] }, thinkingMessage);
        } catch (e) {
            error(e);
        }
    }
};
