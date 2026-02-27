const {
  EmbedBuilder
} = require("discord.js");
const error = require("../../functions/error");
const copyRight = require("../../storage/copyRight.json");
module.exports = {
  name: "add",
  description: "Add coins to a user's wallet (Owner only)",
  category: "owner",
  cooldown: 5,
  aliases: [],
  user_permissions: ["SendMessages"],
  bot_permissions: ["SendMessages", "EmbedLinks"],
  dm_permissions: false,
  only_owner: true,
  only_slash: false,
  only_message: true,

  /**
   * 
   * @param {import("discord.js").Client} client 
   * @param {import("discord.js").Message} interaction 
   * @param {Array<string>} args 
   * @returns 
   */
  run: async (client, interaction, args) => {
    try {
      const db = client.db;
      const user = interaction.guild.members.cache.some(a => a.user.equals(args[0]) || a.id === args[0] || a.user.tag === args[0]) || interaction.mentions.users.first();
      const cash = args[1];
      if (!user) {
        return await interaction.reply({
          content: `❌| Invalid user specified. Please try again.`
        });
      };
      if (user.bot) {
        return await interaction.reply({
          content: `❌| Bots cannot receive coins. Please try again.`
        });
      };


      if (!await db.has(`users.${user.id}`)) {
        return await interaction.reply({
          content: `❌| User profile not found.`
        });
      };

      if (!cash) {
        return await interaction.reply({
          content: `❌| Please specify the coin amount.`
        });
      };

      if (isNaN(cash)) {
        return await interaction.reply({
          content: `❌| Please use a valid number.`
        });
      };

      const profile = await db.get(`users.${user.id}`);
      await db.add(`users.${user.id}.wallet`, cash);
      const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("Economy | Add")
        .setDescription("Coins successfully added to user's wallet.")
        .setFooter({ text: `Owner Embed • ${copyRight.footerText}` })
        .setThumbnail(interaction.author.displayAvatarURL({ forceStatic: true }))
        .addFields([{
            name: "Amount Added:",
            value: `${cash.toLocaleString()} 🪙`,
            inline: true
          }, {
            name: "User:",
            value: `${user}`,
            inline: true
          }, {
            name: "New Balance:",
            value: `${profile.wallet.toLocaleString()} 🪙`,
            inline: true
        }])
        .setTimestamp();

      return await interaction.reply({
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