import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("What is the sound of rocks growing?");

export const execute = async (interaction: CommandInteraction) => {
  return interaction.reply("Emptiness...");
};
