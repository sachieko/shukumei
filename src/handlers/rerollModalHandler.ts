import { MessageFlags, ModalSubmitInteraction } from "discord.js";
import rollData from "./rollDataStore";
import {
  rollEmbedMaker,
} from "../helpers/rollEmbedMaker";

const rerollModalHandler = async (interaction: ModalSubmitInteraction) => {
  if (!interaction.channel || !interaction.message) {
    return await interaction.reply({
      content: "Error: Cannot locate the original message.",
      ephemeral: true,
    });
  }
  const user = interaction.user;
  const rollDataKey = interaction.customId.replace("rollreroll-modal-", "");
  const rollIndexes = interaction.fields
    .getTextInputValue("rollIndex")
    .split("");
  const [userId] = rollDataKey.split("-");
  if (user.id !== userId) {
    await interaction.reply({
      content: "Only the one who created the roll can interact with it.",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }
  const roll = rollData[rollDataKey];
  rollIndexes.forEach((index) => {
    roll.rerollDie(Number(index) - 1); // users start counting at 1 :(
  });
  const resultString = roll.getStringResults().join("");
  const rollEmbed = rollEmbedMaker(
    user.displayName,
    user.displayAvatarURL(),
    interaction.client.user?.displayAvatarURL(),
    roll
  );
  await interaction.message.edit({
    content: `${resultString}`,
    embeds: [rollEmbed],
  });
  await interaction.deferUpdate();
};

export default rerollModalHandler;
