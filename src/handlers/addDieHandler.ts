import {
  ButtonInteraction,
  CacheType,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  LabelBuilder,
} from "discord.js";

export const addDieHandler = async (
  interaction: ButtonInteraction<CacheType>,
) => {
  const rollDataKey = interaction.customId.replace("roll-add-", "");
  const modal = new ModalBuilder()
    .setCustomId(`rolladd-modal-${rollDataKey}`)
    .setTitle("Add Dice");

  const dieAmountInput = new TextInputBuilder()
    .setCustomId("dieAmount")
    .setStyle(TextInputStyle.Short)
    .setMinLength(1)
    .setMaxLength(1)
    .setPlaceholder("1")
    .setRequired(true);

  const dieamountLabel = new LabelBuilder()
    .setLabel("Add how many?")
    .setDescription("Enter a number")
    .setTextInputComponent(dieAmountInput);

  const dieTypeInput = new TextInputBuilder()
    .setCustomId("dieType")
    .setStyle(TextInputStyle.Short)
    .setMinLength(1)
    .setMaxLength(1)
    .setPlaceholder("R")
    .setRequired(true);

  const dieTypeLabel = new LabelBuilder()
    .setLabel("Ring or Skill Dice?")
    .setDescription("Enter R for black Ring dice and S for white Skill dice.")
    .setTextInputComponent(dieTypeInput);

  const dieValueInput = new TextInputBuilder()
    .setCustomId("dieSymbol")
    .setStyle(TextInputStyle.Short)
    .setMinLength(1)
    .setMaxLength(2)
    .setPlaceholder("OS")
    .setRequired(false);

  const dieValueLabel = new LabelBuilder()
    .setLabel("Any Symbols on the dice?")
    .setDescription(
      "Choose: OS, S, ES, SS, O, B. Use /help symbols cmd for more info.",
    )
    .setTextInputComponent(dieValueInput);

  const keptInput = new TextInputBuilder()
    .setCustomId("dieKept")
    .setStyle(TextInputStyle.Short)
    .setMinLength(0)
    .setMaxLength(1)
    .setPlaceholder("K")
    .setRequired(false);

  const keptLabel = new LabelBuilder()
    .setLabel("Is this die already kept?")
    .setDescription("Input: K = Kept, R = Rolled")
    .setTextInputComponent(keptInput);

  modal.addLabelComponents(dieamountLabel, dieTypeLabel, dieValueLabel, keptLabel);

  await interaction.showModal(modal);
};
