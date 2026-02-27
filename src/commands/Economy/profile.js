const {
  EmbedBuilder,
  ApplicationCommandType,
  ApplicationCommandOptionType
} = require("discord.js");
const error = require("../../functions/error");
const copyRight = require("../../storage/copyRight.json");
module.exports = {
  name: "profile",
  description: "View your profile or others in the bot",
  category: "economy",
  type: ApplicationCommandType.ChatInput,
  cooldown: 10,
  user_permissions: ["SendMessages"],
  bot_permissions: ["SendMessages", "EmbedLinks"],
  dm_permissions: false,
  only_owner: false,
  only_slash: true,
  only_message: false,
  options: [{
    name: "user",
    type: ApplicationCommandOptionType.User,
    description: "Select a user to view their profile"
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
      const db = client.db;
      const user = interaction.options.getUser("user");

      if (user) {
        if (user.bot) {
          await interaction.deferReply({ ephemeral: true });
          return await interaction.editReply({
            content: `❌| Bots cannot have profiles.`
          });
        };

        if (!await db.has(`users.${user.id}`)) {
          await interaction.deferReply({ ephemeral: true });
          return await interaction.editReply({
            content: `❌| The specified user doesn't have a profile in the bot.`
          });
        };

        await interaction.deferReply({ ephemeral: false });
        const profile = await db.get(`users.${user.id}`);
        const embed = new EmbedBuilder()
          .setAuthor({ name: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ forceStatic: true }) })
          .setColor("Aqua")
          .setTitle("Economy | Profile")
          .setDescription("User profile found successfully.")
          .setFooter({ text: `Economy Embed • ${copyRight.footerText}` })
          .setThumbnail(user.displayAvatarURL({ forceStatic: true }))
          .addFields([{
            name: "User:",
            value: `${user}`,
            inline: true
          }, {
            name: "Wallet:",
            value: `${profile.wallet.toLocaleString()} 🪙`,
            inline: true
          }, {
            name: "Work Level:",
            value: `${profile.work} Level 💼`,
            inline: true
          }, {
            name: "Rob Level:",
            value: `${profile.rob} Level 🔦`,
            inline: true
          }, {
            name: "Home Level:",
            value: `${profile.home} Level 🏡`,
            inline: true
          }, {
            name: "Miner Level:",
            value: `${profile.miner} Level ⛏`,
            inline: true
          }])
          .setTimestamp();

        return await interaction.editReply({
          embeds: [embed]
        });
      } else {
        if (!await db.has(`users.${interaction.user.id}`)) {
          await interaction.deferReply({ ephemeral: true });
          const cmd = client.application.commands.cache.find(c => c.name === "register");
          return await interaction.editReply({
            content: `❌| You don't have any profile in the bot.\n(Use the </${cmd.name}:${cmd.id}> command to create a profile for yourself.)`
          });
        };


        await interaction.deferReply({ ephemeral: false });
        const profile = await db.get(`users.${interaction.user.id}`);
        const embed = new EmbedBuilder()
          .setColor("Aqua")
          .setTitle("Economy | Profile")
          .setDescription("Your profile found successfully.")
          .setFooter({ text: `Economy Embed • ${copyRight.footerText}` })
          .setThumbnail(interaction.user.displayAvatarURL({ forceStatic: true }))
          .addFields([{
            name: "کیف پول:",
            value: `${profile.wallet.toLocaleString()} 🪙`,
            inline: true
          }, {
            name: "سطح کار:",
            value: `${profile.work} Level 💼`,
            inline: true
          }, {
            name: "سطح دزدی:",
            value: `${profile.rob} Level 🔦`,
            inline: true
          }, {
            name: "سطح خانه:",
            value: `${profile.home} Level 🏡`,
            inline: true
          }, {
            name: "سطح ماینر:",
            value: `${profile.miner} Level ⛏`,
            inline: true
          }])
          .setTimestamp();

        return await interaction.editReply({
          embeds: [embed]
        });
      };
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