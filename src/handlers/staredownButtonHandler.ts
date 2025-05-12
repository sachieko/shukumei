import {
  ActionRowBuilder,
  ButtonInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

const staredownButtonHandler = async (
  interaction: ButtonInteraction
) => {
  const bidKey = interaction.customId.replace("staredown-bid-", "");
  const [, targetId] = bidKey.split("-");

  // User validation
  if (interaction.user.id !== targetId) {
    await interaction.reply({
      content: "Only the user challenged can respond to the staredown.",
      ephemeral: true,
    });
    return;
  }

  const modal = new ModalBuilder()
    .setCustomId(`staredown-modal-${bidKey}`)
    .setTitle("Bid Strife");

  const bidInput = new TextInputBuilder()
    .setCustomId("bidAmount")
    .setLabel("Bid an amount from 0 up to your Focus attribute.")
    .setStyle(TextInputStyle.Short)
    .setMinLength(1)
    .setMaxLength(2)
    .setPlaceholder("0")
    .setRequired(true);

  const actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
    bidInput
  );
  modal.addComponents(actionRow);

  await interaction.showModal(modal);
};

export default staredownButtonHandler;
