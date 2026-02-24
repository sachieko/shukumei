import { MessageFlags, ModalSubmitInteraction } from "discord.js";
import rollData from "./rollDataStore";
import { rollEmbedMaker } from "../helpers/rollEmbedMaker";
import { fetchNickname } from "../helpers/fetchUtils";
import { STATE } from "../types/diceConstants";

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
    .split(/[,\s]+/) // split on comma or spaces
    .filter((index) => index) // filter empty strings
    .map((index) => Number(index));
  const [userId] = rollDataKey.split("-");
  if (user.id !== userId) {
    await interaction.reply({
      content: "Only the one who created the roll can interact with it.",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }
  const roll = rollData[rollDataKey];
  if (!roll) {
    await interaction.reply({
      content: "This roll no longer exists, this most likely means the roll has been left uncompleted for too long or the bot went down while you were trying to finish the roll.",
      flags: MessageFlags.Ephemeral,
    })
    return; // Prevent crashes if the bot crashed and a user tries to interact with a discarded roll
  }
  if (
    !rollIndexes.every((index) => typeof index === typeof 5) ||
    rollIndexes.some((index) => index > roll.getDiceLength())
  ) {
    return await interaction.reply({
      content: "You can only enter numbers in the range.",
      flags: MessageFlags.Ephemeral,
    });
  }
  const nickname = await fetchNickname(interaction);
  rollIndexes.forEach((index) => {
    roll.rerollDie(index - 1); // users start counting at 1 :(
  });
  roll.setState(STATE.REROLLED);
  const resultString = roll.getStringResults();
  const rollEmbed = rollEmbedMaker(
    nickname || user.displayName,
    user.displayAvatarURL(),
    interaction.client.user?.displayAvatarURL(),
    roll,
  );
  try {
    await interaction.message.edit({
      content: resultString,
      embeds: [rollEmbed],
    });
  } catch (err) {
    interaction.reply({
      content:
        "Shukumei does not have permissions to interact with the message in this channel it seems. Make sure it is in the member list for this channel!",
      flags: MessageFlags.Ephemeral,
    });
  }
  await interaction.deferUpdate().catch(console.error);
};

export default rerollModalHandler;
