import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import InteractionHandler from "../types/interactionHandler";

const handler: InteractionHandler<ChatInputCommandInteraction> = {
  handle: async (interaction) => {
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`Command ${interaction.commandName} not found.`);
      await interaction.reply({
        content: "Command not found on server. The magistrates chastise you.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "There was an error while executing this command. Most commonly this is because the bot cannot see the channel. Ensure it is on the member list on the right while in the channel, as it needs the right travel permits.",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};

export default handler;
