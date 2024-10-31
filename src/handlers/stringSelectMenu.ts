import InteractionHandler from "../types/interactionHandler";
import { StringSelectMenuInteraction } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const handler: InteractionHandler<StringSelectMenuInteraction> = {
  handle: async (interaction) => {
    // use interaction.customId to determine which string select menu was used
    if (interaction.customId === "stance") {
      return; // All logic handled inside predict.ts in commands/utility
    } else {
      console.error(
        `Unknown StringSelectMenuInteraction ${interaction.customId}`
      );
      interaction.deferUpdate().catch(console.error);
    }
  },
};

export default handler;
