import {
  ButtonInteraction,
  CacheType,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  LabelBuilder,
} from "discord.js";

export const modDieHandler = async (
  interaction: ButtonInteraction<CacheType>,
) => {
  const rollDataKey = interaction.customId.replace("roll-mod-", "");
  const modal = new ModalBuilder()
    .setCustomId(`rollmod-modal-${rollDataKey}`)
    .setTitle("Mod Dice");

  const dieIndexInput = new TextInputBuilder()
    .setCustomId("rollIndex")
    .setStyle(TextInputStyle.Short)
    .setMinLength(1)
    .setMaxLength(30)
    .setPlaceholder("ie: 1 3 5")
    .setRequired(true);

  const dieIndexLabel = new LabelBuilder()
    .setLabel("Enter dice index numbers to modify")
    .setDescription("This will change what the dice was previously! (⤵️)")
    .setTextInputComponent(dieIndexInput);

  const symbolInput = new TextInputBuilder()
    .setCustomId("dieSymbol")
    .setStyle(TextInputStyle.Short)
    .setMinLength(1)
    .setMaxLength(2)
    .setPlaceholder("OS")
    .setRequired(false);

  const symbolLabel = new LabelBuilder()
    .setLabel("What dice symbols should they become?")
    .setDescription(
      "Use: OS, SS, S, O, ES, or E. Use /help modify for more information.",
    )
    .setTextInputComponent(symbolInput);

  const keptInput = new TextInputBuilder()
    .setCustomId("dieKept")
    .setLabel("Enter K to keep beyond keep limit.")
    .setStyle(TextInputStyle.Short)
    .setMinLength(0)
    .setMaxLength(1)
    .setPlaceholder("K")
    .setRequired(false);

  const keptLabel = new LabelBuilder()
    .setLabel("Should the dice be kept if it wasn't yet?")
    .setDescription(
      "This will keep above your normal limit, use with GM permission. /help modify for more info.",
    )
    .setTextInputComponent(keptInput);

  modal.addLabelComponents(dieIndexLabel, symbolLabel, keptLabel);

  await interaction.showModal(modal);
};
