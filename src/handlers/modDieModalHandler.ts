import { MessageFlags, ModalSubmitInteraction } from "discord.js";
import rollData from "./rollDataStore";
import { rollEmbedMaker } from "../helpers/rollEmbedMaker";
import { fetchNickname } from "../helpers/fetchUtils";
import {
  EXPLODE,
  MODDED,
  STATE,
  SYMBOL_TO_VALUE,
} from "../types/diceConstants";

const modDieModalHandler = async (interaction: ModalSubmitInteraction) => {
  if (!interaction.channel || !interaction.message) {
    return await interaction.reply({
      content: "Error: Cannot locate the original message.",
      ephemeral: true,
    });
  }
  const user = interaction.user;
  const rollDataKey = interaction.customId.replace("rollmod-modal-", "");
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
  const dieSymbol = interaction.fields
    .getTextInputValue("dieSymbol")
    .toUpperCase();
  const dieIsKept = interaction.fields
    .getTextInputValue("dieKept")
    .toUpperCase();
  if (
    dieSymbol !== "OS" &&
    dieSymbol !== "S" &&
    dieSymbol !== "SS" &&
    dieSymbol !== "O" &&
    dieSymbol !== "E" &&
    dieSymbol !== "ES" &&
    dieSymbol !== ""
  ) {
    return await interaction.reply({
      content:
        "You chose an incorrect die symbol. For reference: O will add a dice with Opportunity, S for Success, OS for Opportunity and Strife on a Ring die or Opportunity Success on a Skill die, E for Explosive or Explosive Strife on a Ring die, ES for Explosive and Strife, and SS for Success and Strife. These are letters and not numbers.",
      flags: MessageFlags.Ephemeral,
    });
  }
  const roll = rollData[rollDataKey];
  if (
    // We use typeof 5 to get the type of a number here
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
    const trueIndex = index - 1; // users count from 1
    const dieType = roll.getDieType(trueIndex);
    if (dieSymbol !== "") {
      roll.setDie(trueIndex, SYMBOL_TO_VALUE[dieType][dieSymbol]);
    }
    if (dieIsKept === "K") {
      if (!roll.isDieKept(trueIndex)) {
        roll.forceKeepDie(trueIndex);
      }
      if (roll.getDieSource(trueIndex) !== EXPLODE) {
        // if we overwrite dice from explosives, it affects kept dice.
        roll.setDieSource(trueIndex, MODDED);
      }
    }
  });

  roll.setState(STATE.MODDED);
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

export default modDieModalHandler;
