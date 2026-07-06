const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");
const error = require("./error");

function isSlash(interaction) {
    return typeof interaction?.isCommand === "function";
}

function getPrompt(interaction, args, optionName = "prompt") {
    if (isSlash(interaction)) return interaction.options.getString(optionName);
    return args.join(" ").trim();
}

async function sendThinking(interaction, message) {
    if (isSlash(interaction)) return await interaction.deferReply({ fetchReply: true });
    return await interaction.reply(message);
}

async function sendFinal(interaction, payload, thinkingMessage) {
    if (isSlash(interaction)) return await interaction.editReply(payload);
    if (thinkingMessage?.edit) return await thinkingMessage.edit(payload);
    return await interaction.reply(payload);
}

function buildImageUrl(prompt) {
    const params = new URLSearchParams({
        width: "1024",
        height: "1024",
        model: "flux",
        nologo: "true",
        enhance: "true"
    });

    return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${params.toString()}`;
}

function buildTextUrl(question) {
    return `https://text.pollinations.ai/${encodeURIComponent(question)}`;
}

function trimDiscordText(text, max = 3900) {
    if (!text) return "I could not generate an answer right now.";
    return text.length > max ? `${text.slice(0, max - 3)}...` : text;
}

module.exports = {
    isSlash,
    getPrompt,
    sendThinking,
    sendFinal,
    buildImageUrl,
    buildTextUrl,
    trimDiscordText,
    EmbedBuilder,
    ApplicationCommandType,
    ApplicationCommandOptionType,
    error
};
