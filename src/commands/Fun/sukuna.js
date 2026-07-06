const {
    sendThinking,
    sendFinal,
    buildImageUrl,
    EmbedBuilder,
    ApplicationCommandType,
    error
} = require("../../functions/aiCommands");

module.exports = {
    name: "sukuna",
    description: "Generate a Sukuna-inspired AI image.",
    category: "fun",
    cooldown: 10,
    type: ApplicationCommandType.ChatInput,
    user_permissions: ["SendMessages"],
    bot_permissions: ["SendMessages", "EmbedLinks"],
    dm_permissions: false,
    only_owner: false,
    only_slash: true,
    only_message: true,

    run: async (client, interaction) => {
        try {
            const prompt = "Ryomen Sukuna from Jujutsu Kaisen, dark anime style, red cursed energy, dramatic lighting, highly detailed, cinematic, 4k";
            const thinkingMessage = await sendThinking(interaction, "👹 Generating Sukuna...");
            const embed = new EmbedBuilder()
                .setColor("DarkRed")
                .setTitle("Sukuna Image Generated")
                .setDescription("A Sukuna-inspired AI image.")
                .setImage(buildImageUrl(prompt))
                .setTimestamp();

            return await sendFinal(interaction, { content: "", embeds: [embed] }, thinkingMessage);
        } catch (e) {
            error(e);
        }
    }
};
