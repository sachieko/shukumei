import { ModalSubmitInteraction } from "discord.js";
import InteractionHandler from "../types/interactionHandler";
import dotenv from "dotenv";
import staredownModalHandler from "./staredownModalHandler";
import keepModalHandler from "./keepModalHandler";
import rerollModalHandler from "./rerollModalHandler";
import addDieModalHandler from "./addDieModalHandler";
import modDieModalHandler from "./modDieModalHandler";

dotenv.config();

const handler: InteractionHandler<ModalSubmitInteraction> = {
  handle: async (interaction) => {
    // Early exit if the bot can't interact.
    if (!interaction.channel || !interaction.message) {
    try {
      return await interaction.reply({
        content: "Error: Cannot locate the original message or channel, shukumei may lack permissions.",
        ephemeral: true,
      });
    } catch (err) {
      console.error(`Error in modalSubmit.ts: ${err}`)
    }
  }
    // use interaction.customId to determine which modal was submitted
    if (interaction.customId.startsWith("staredown-modal-")) {
      await staredownModalHandler(interaction);
      return;
    }
    if (interaction.customId.startsWith("rollkeep-modal-")) {
      await keepModalHandler(interaction);
      return;
    }
    if (interaction.customId.startsWith("rollreroll-modal-")) {
      await rerollModalHandler(interaction);
      return;
    }
    if (interaction.customId.startsWith("rolladd-modal-")) {
      await addDieModalHandler(interaction);
      return;
    }
    if (interaction.customId.startsWith("rollmod-modal-")) {
      await modDieModalHandler(interaction);
      return;
    }
    console.error(`Unknown ModalSubmitInteraction ${interaction.customId}`);
    interaction.deferUpdate().catch(console.error);
  },
};

export default handler;
