import { ButtonInteraction } from "discord.js";
import { keepHandler } from "./keepHandler";
import { rerollHandler } from "./rerollHandler";

const diceInteractHandler = async (interaction: ButtonInteraction) => {
  if (interaction.customId.startsWith("roll-keep-")) {
    await keepHandler(interaction);
    return;
  }
  if (interaction.customId.startsWith("roll-reroll-")) {
    await rerollHandler(interaction);
    return;
  }
  if (interaction.customId.startsWith("roll-add-")) {
    return;
  }
  if (interaction.customId.startsWith("roll-final-")) {
    return;
  }
  console.error(`Unknown StringSelectMenuInteraction ${interaction.customId}`);
  interaction.deferUpdate().catch(console.error);
};

export default diceInteractHandler;
