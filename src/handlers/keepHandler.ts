import {
  ButtonInteraction,
  CacheType,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  LabelBuilder,
} from "discord.js";

export const keepHandler = async (
  interaction: ButtonInteraction<CacheType>,
) => {
  const rollDataKey = interaction.customId.replace("roll-keep-", "");
  const modal = new ModalBuilder()
    .setCustomId(`rollkeep-modal-${rollDataKey}`)
    .setTitle("Keep Dice");

  const dieIndexInput = new TextInputBuilder()
    .setCustomId("keepIndex")
    .setStyle(TextInputStyle.Short)
    .setMinLength(1)
    .setMaxLength(30)
    .setPlaceholder("ie: 1 2 3 5")
    .setRequired(true);

  const dieIndexLabel = new LabelBuilder()
    .setLabel("Which dice do you want to keep?")
    .setDescription(
      "Do not enter index numbers of dice you have already kept, you will unkeep them if you do.",
    )
    .setTextInputComponent(dieIndexInput);

  modal.addLabelComponents(dieIndexLabel);

  await interaction.showModal(modal);
};
