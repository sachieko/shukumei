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
    .setLabel(`Symbol: OS, SS, S, O`)
    .setStyle(TextInputStyle.Short)
    .setMinLength(1)
    .setMaxLength(2)
    .setPlaceholder("OS")
    .setRequired(true);
  const actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
    dieIndexInput
  );
  const valueActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
    symbolInput
  );

  modal.addComponents(actionRow, valueActionRow);

  await interaction.showModal(modal);
};
