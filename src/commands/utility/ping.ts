import {
  CommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("What is the sound of rocks growing?");

export const execute = async (interaction: CommandInteraction) => {
  await interaction.reply({
    content: "Emptiness...",
    flags: MessageFlags.Ephemeral,
  });
};

module.exports = {
  data,
  execute,
};
