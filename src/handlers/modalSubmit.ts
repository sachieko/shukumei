import { ModalSubmitInteraction } from "discord.js";
import InteractionHandler from "../types/interactionHandler";
import dotenv from "dotenv";
import staredownModalHandler from "./staredownModalHandler";

dotenv.config();

const handler: InteractionHandler<ModalSubmitInteraction> = {
  handle: async (interaction) => {
    if (!interaction.isModalSubmit()) return;
    // use interaction.customId to determine which modal was submitted
    if (interaction.customId.startsWith("staredown-modal-")) {
      await staredownModalHandler(interaction);
      return;
    }
    console.error(`Unknown ModalSubmitInteraction ${interaction.customId}`);
    interaction.deferUpdate().catch(console.error);
  },
};

export default handler;
