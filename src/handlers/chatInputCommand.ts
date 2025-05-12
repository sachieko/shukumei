import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import InteractionHandler from "../types/interactionHandler";

const handler: InteractionHandler<ChatInputCommandInteraction> = {
  handle: async (interaction) => {
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`Command ${interaction.commandName} not found.`);
      await interaction.reply({
        content: "Command not found on server.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "There was an error while executing this command.",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};

export default handler;
