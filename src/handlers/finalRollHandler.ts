import { MessageFlags, ButtonInteraction } from "discord.js";
import rollData from "./rollDataStore";
import { rollEmbedMaker } from "../helpers/rollEmbedMaker";
import { STATE } from "../types/diceConstants";
import { fetchNickname } from "../helpers/fetchUtils";

const finalRollHandler = async (interaction: ButtonInteraction) => {
  if (!interaction.channel || !interaction.message) {
    return await interaction.reply({
      content: "Error: Cannot locate the original message.",
      ephemeral: true,
    });
  }
  const user = interaction.user;
  const rollDataKey = interaction.customId.replace("roll-final-", "");
  const [userId] = rollDataKey.split("-");
  if (user.id !== userId) {
    await interaction.reply({
      content: "Only the one who created the roll can interact with it.",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }
  const roll = rollData[rollDataKey];
  if (roll.getKeptDice() === 0) {
    await interaction.reply({
      content: "Rolls must resolve with at least 1 kept die, see the core rulebook :)",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }
  const nickname = await fetchNickname(interaction);
  roll.setState(STATE.FINAL);
  const resultString = roll.getFinalStrings().join("");
  const rollEmbed = rollEmbedMaker(
    nickname || user.displayName,
    user.displayAvatarURL(),
    interaction.client.user?.displayAvatarURL(),
    roll
  );
  await interaction.message.edit({
    content: `${resultString}`,
    embeds: [rollEmbed],
    components: [],
  });
  delete rollData[rollDataKey]; // clean up the mock db object
  await interaction.deferUpdate().catch(console.error);
};

export default finalRollHandler;
