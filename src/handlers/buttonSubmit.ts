import InteractionHandler from "../types/interactionHandler";
import { ButtonInteraction } from "discord.js";
import staredownButtonHandler from "./staredownButtonHandler";
import dotenv from "dotenv";

dotenv.config();

const handler: InteractionHandler<ButtonInteraction> = {
  handle: async (interaction) => {
    // use interaction.customId to determine which string select menu was used
    if (interaction.customId === "choosestance") {
      return; // All logic handled inside predict.ts in commands/utility
    }
    if (interaction.customId.startsWith(`staredown-bid-`)) {
      await staredownButtonHandler(interaction);
      return;
    }
    console.error(
      `Unknown StringSelectMenuInteraction ${interaction.customId}`
    );
    interaction.deferUpdate().catch(console.error);
  },
};

export default handler;
