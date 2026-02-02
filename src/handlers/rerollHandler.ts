import {
  ButtonInteraction,
  CacheType,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  LabelBuilder,
} from "discord.js";

export const rerollHandler = async (
  interaction: ButtonInteraction<CacheType>,
) => {
  const rollDataKey = interaction.customId.replace("roll-reroll-", "");
  const modal = new ModalBuilder()
    .setCustomId(`rollreroll-modal-${rollDataKey}`)
    .setTitle("Reroll Dice");

  const dieIndexInput = new TextInputBuilder()
    .setCustomId("rollIndex")
    .setStyle(TextInputStyle.Short)
    .setMinLength(1)
    .setMaxLength(30)
    .setPlaceholder("ie: 1 2 5")
    .setRequired(true);

  const dieIndexLabel = new LabelBuilder()
    .setLabel("What dice will be rerolled?")
    .setDescription(
      "This will cause any dice chosen to be rerolled, do this before keeping any dice!",
    )
    .setTextInputComponent(dieIndexInput);

  modal.addLabelComponents(dieIndexLabel);

  await interaction.showModal(modal);
};
