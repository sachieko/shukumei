import { MessageFlags, ModalSubmitInteraction } from "discord.js";
import rollData from "./rollDataStore";
import { rollEmbedMaker } from "../helpers/rollEmbedMaker";
import { fetchNickname } from "../helpers/fetchUtils";
import { D12, D6, STATE, SYMBOL_TO_VALUE } from "../types/diceConstants";


const addDieModalHandler = async (interaction: ModalSubmitInteraction) => {
  if (!interaction.channel || !interaction.message) {
    return await interaction.reply({
      content: "Error: Cannot locate the original message.",
      ephemeral: true,
    });
  }
  const user = interaction.user;
  const nickname = await fetchNickname(interaction);
  const rollDataKey = interaction.customId.replace("rolladd-modal-", "");
  const dieType = interaction.fields.getTextInputValue("dieType").toUpperCase();
  const dieSymbol = interaction.fields
    .getTextInputValue("dieSymbol")
    .toUpperCase();
  const [userId] = rollDataKey.split("-");
  if (user.id !== userId) {
    await interaction.reply({
      content: "Only the one who created the roll can interact with it.",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }
  const roll = rollData[rollDataKey];
  if (dieType !== "R" && dieType !== "S") {
    return await interaction.reply({
      content:
        "You chose an incorrect die type. Please use R for ring or S for a skill die",
      flags: MessageFlags.Ephemeral,
    });
  }
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
  const type = dieType === "R" ? D6 : D12;
  const value = SYMBOL_TO_VALUE[type][dieSymbol];
  roll.addKeptDie(type, value);
  roll.setState(STATE.ADDED);
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

export default addDieModalHandler;
