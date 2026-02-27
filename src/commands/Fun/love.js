const {
  EmbedBuilder,
  ApplicationCommandOptionType,
  ApplicationCommandType
} = require("discord.js");
const copyRight = require("../../storage/copyRight.json");
const error = require("../../functions/error");
module.exports = {
  name: "love",
  description: "Calculate love percentage between you and another user",
  category: "fun",
  cooldown: 5,
  type: ApplicationCommandType.ChatInput,
  user_permissions: ["SendMessages"],
  bot_permissions: ["SendMessages", "EmbedLinks"],
  dm_permissions: false,
  only_owner: false,
  only_slash: true,
  only_message: false,
  options: [{
    name: "user",
    type: ApplicationCommandOptionType.User,
    description: "Select a user to calculate love with",
    required: true
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
      const target = interaction.options.getUser("user");
      if (target.id === interaction.user.id) return interaction.reply("**Please select someone else!**")
      const random = Math.floor(Math.random() * 99) + 1;
      const embed = new EmbedBuilder().setColor("Purple").setDescription(`**${interaction.user}**, your love percentage with **${target}** is **${random}%** 💕`).setFooter({ text: `Requested by ${interaction.user.username} • ${copyRight.footerText}`, iconURL: copyRight.footerIcon });
      if (random >= 50) {
        embed.setThumbnail('https://cdn.discordapp.com/attachments/944668553439760434/1098155294707695616/image.png')
      } else {
        embed.setThumbnail('https://cdn.discordapp.com/attachments/944668553439760434/1098155295320051812/image.png')
      }
      setTimeout(() => {
        interaction.reply({
          embeds: [embed]
        })
      }, 1000)
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