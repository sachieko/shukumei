import { MessageFlags, ModalSubmitInteraction } from "discord.js";
import rollData from "./rollDataStore";
import { rollEmbedMaker } from "../helpers/rollEmbedMaker";
import { fetchNickname } from "../helpers/fetchUtils";
import { MODDED, STATE, SYMBOL_TO_VALUE } from "../types/diceConstants";

const modDieModalHandler = async (interaction: ModalSubmitInteraction) => {
  if (!interaction.channel || !interaction.message) {
    return await interaction.reply({
      content: "Error: Cannot locate the original message.",
      ephemeral: true,
    });
  }
  const user = interaction.user;
  const nickname = await fetchNickname(interaction);
  const rollDataKey = interaction.customId.replace("rollmod-modal-", "");
  const rollIndexes = interaction.fields
    .getTextInputValue("rollIndex")
    .split(/[,\s]+/) // split on comma or spaces
    .filter((index) => index) // filter empty strings
    .map((index) => Number(index));
  const dieSymbol = interaction.fields
    .getTextInputValue("dieSymbol")
    .toUpperCase();
    if (
    dieSymbol !== "OS" &&
    dieSymbol !== "S" &&
    dieSymbol !== "SS" &&
    dieSymbol !== "O"
  ) {
    return await interaction.reply({
      content:
        "You chose an incorrect die symbol. For reference: O will add a dice with Opportunity, S for Success, OS for Opportunity and Strife on a Ring die or Opportunity Success on a Skill die, and SS for Success and Strife. These are letters and not numbers.",
      flags: MessageFlags.Ephemeral,
    });
  }
  const [userId] = rollDataKey.split("-");
  if (user.id !== userId) {
    await interaction.reply({
      content: "Only the one who created the roll can interact with it.",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }
  const roll = rollData[rollDataKey];
  if (
    !rollIndexes.every((index) => typeof index === typeof 5) ||
    rollIndexes.some((index) => index > roll.getDiceLength())
  ) {
    return await interaction.reply({
      content: "You can only enter numbers in the range.",
      flags: MessageFlags.Ephemeral,
    });
  }
  rollIndexes.forEach((index) => {
    const dieType = roll.getDieType(index - 1);
    roll.setDie(index - 1, SYMBOL_TO_VALUE[dieType][dieSymbol], MODDED); // users start counting at 1 :(
  });

  roll.setState(STATE.MODDED);
  const resultString = roll.getStringResults().join("");
  const rollEmbed = rollEmbedMaker(
    nickname || user.displayName,
    user.displayAvatarURL(),
    interaction.client.user?.displayAvatarURL(),
    roll
  );
  await interaction.message.edit({
    content: `${resultString}`,
    embeds: [rollEmbed],
  });
  await interaction.deferUpdate().catch(console.error);
};

export default modDieModalHandler;
