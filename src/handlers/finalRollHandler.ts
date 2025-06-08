import { MessageFlags, ButtonInteraction } from "discord.js";
import rollData from "./rollDataStore";
import {
  rollEmbedMaker,
} from "../helpers/rollEmbedMaker";
import { FINAL } from "../types/diceConstants";

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
  roll.removeUnkept();
  roll.setState(FINAL);
  const resultString = roll.getStringResults().join("");
  const rollEmbed = rollEmbedMaker(
    interaction.member?.user?.username || user.displayName,
    user.displayAvatarURL(),
    interaction.client.user?.displayAvatarURL(),
    roll
  );
  await interaction.message.edit({
    content: `${resultString}`,
    embeds: [rollEmbed],
    components: []
  });
  await interaction.deferUpdate();
};

export default finalRollHandler;
