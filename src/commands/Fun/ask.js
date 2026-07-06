const {
    getPrompt,
    sendThinking,
    sendFinal,
    buildTextUrl,
    trimDiscordText,
    EmbedBuilder,
    ApplicationCommandType,
    ApplicationCommandOptionType,
    error
} = require("../../functions/aiCommands");

module.exports = {
    name: "ask",
    aliases: ["ai", "chat"],
    description: "Ask AI a question.",
    category: "fun",
    cooldown: 5,
    type: ApplicationCommandType.ChatInput,
    user_permissions: ["SendMessages"],
    bot_permissions: ["SendMessages", "EmbedLinks"],
    dm_permissions: false,
    only_owner: false,
    only_slash: true,
    only_message: true,
    options: [{
        name: "question",
        type: ApplicationCommandOptionType.String,
        description: "What do you want to ask?",
        required: true
    }],

    run: async (client, interaction, args) => {
        try {
            const question = getPrompt(interaction, args, "question");
            if (!question) return await interaction.reply({ content: "Please provide a question." });

            const thinkingMessage = await sendThinking(interaction, "🤖 Thinking...");
            const answer = await fetch(buildTextUrl(question)).then((res) => res.text());
            const embed = new EmbedBuilder()
                .setColor("Aqua")
                .setTitle("AI Answer")
                .addFields(
                    { name: "Question", value: trimDiscordText(question, 1000) },
                    { name: "Answer", value: trimDiscordText(answer) }
                )
                .setTimestamp();

            return await sendFinal(interaction, { content: "", embeds: [embed] }, thinkingMessage);
        } catch (e) {
            error(e);
        }
    }
};
