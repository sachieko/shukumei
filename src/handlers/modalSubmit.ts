import { ModalSubmitInteraction } from "discord.js";
import InteractionHandler from "../types/interactionHandler";
import dotenv from "dotenv";

dotenv.config();

const handler: InteractionHandler<ModalSubmitInteraction> = {
  handle: async (interaction) => {
    // use interaction.customId to determine which modal was submitted
    console.error(`Unknown ModalSubmitInteraction ${interaction.customId}`);
    interaction.deferUpdate().catch(console.error);
  },
};

export default handler;
