import {
  ButtonInteraction,
  LabelBuilder,
  MessageFlags,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

const staredownButtonHandler = async (interaction: ButtonInteraction) => {
  const bidKey = interaction.customId.replace("staredown-bid-", "");
  const [, targetId] = bidKey.split("-");

  // User validation
  if (interaction.user.id !== targetId) {
    await interaction.reply({
      content: "Only the user challenged can respond to the staredown.",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  const modal = new ModalBuilder()
    .setCustomId(`staredown-modal-${bidKey}`)
    .setTitle("Bid Strife");

  const bidInput = new TextInputBuilder()
    .setCustomId("bidAmount")
    .setStyle(TextInputStyle.Short)
    .setMinLength(1)
    .setMaxLength(2)
    .setPlaceholder("0-Focus")
    .setRequired(true);

  const bidLabel = new LabelBuilder()
    .setLabel("Enter a strife bid.")
    .setDescription("Can bid between 0 up to your character''s focus.")
    .setTextInputComponent(bidInput);

  modal.addLabelComponents(bidLabel);

  await interaction.showModal(modal);
};

export default staredownButtonHandler;
