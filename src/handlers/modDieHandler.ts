import {
  ButtonInteraction,
  CacheType,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} from "discord.js";

export const modDieHandler = async (
  interaction: ButtonInteraction<CacheType>
) => {
  const rollDataKey = interaction.customId.replace("roll-mod-", "");
  const modal = new ModalBuilder()
    .setCustomId(`rollmod-modal-${rollDataKey}`)
    .setTitle("Mod Dice");

  const dieIndexInput = new TextInputBuilder()
    .setCustomId("rollIndex")
    .setLabel("Enter numbers of the dice.")
    .setStyle(TextInputStyle.Short)
    .setMinLength(1)
    .setMaxLength(30)
    .setPlaceholder("1 2 3 5")
    .setRequired(true);

  const symbolInput = new TextInputBuilder()
    .setCustomId("dieSymbol")
    .setLabel(`Symbol: OS, SS, S, O, ES, E`)
    .setStyle(TextInputStyle.Short)
    .setMinLength(1)
    .setMaxLength(2)
    .setPlaceholder("OS")
    .setRequired(false);

  const keptInput = new TextInputBuilder()
    .setCustomId("dieKept")
    .setLabel("Enter K to keep beyond keep limit.")
    .setStyle(TextInputStyle.Short)
    .setMinLength(0)
    .setMaxLength(1)
    .setPlaceholder("K")
    .setRequired(false);

  const actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
    dieIndexInput
  );
  const valueActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
    symbolInput
  );

  const keptActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
    keptInput
  );

  modal.addComponents(actionRow, valueActionRow, keptActionRow);

  await interaction.showModal(modal);
};
