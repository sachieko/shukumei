import { ModalSubmitInteraction } from "discord.js";
import bidData from "./bidDataStore";

const staredownModalHandler = async (
  interaction: ModalSubmitInteraction
) => {
  const bidKey = interaction.customId.replace('bid-modal-', '');
  const [initiatorId, targetId] = bidKey.split('-');
  // Parse number from string in case we want to make comparison logic in a future change.
  const responseBid = interaction.fields.getTextInputValue('bidAmount');
  const responseNumber = parseInt(responseBid, 10);
  if (isNaN(responseNumber) || responseNumber < 0 || responseNumber > 12) {
        await interaction.reply({ content: "Please enter a valid number between 0 and your Focus.", ephemeral: true });
        return;
  }

  const originalNumber = bidData[bidKey];
  delete bidData[bidKey];
  const staredownMsg = `<@${initiatorId}> bids ${originalNumber} strife. \n <@${targetId}> has bid ${responseNumber} strife.`
  await interaction.reply({content: staredownMsg})
};

export default staredownModalHandler;
