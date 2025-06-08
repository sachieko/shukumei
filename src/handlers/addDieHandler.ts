import {
  ButtonInteraction,
  CacheType,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} from "discord.js";

export const addDieHandler = async (
  interaction: ButtonInteraction<CacheType>
) => {
  const rollDataKey = interaction.customId.replace("roll-add-", "");
  const modal = new ModalBuilder()
    .setCustomId(`rolladd-modal-${rollDataKey}`)
    .setTitle("Add Dice");

  const dieTypeInput = new TextInputBuilder()
    .setCustomId("dieType")
    .setLabel("Die Type: R or S")
    .setStyle(TextInputStyle.Short)
    .setMinLength(1)
    .setMaxLength(1)
    .setPlaceholder("R")
    .setRequired(true);

  const dieValueInput = new TextInputBuilder()
    .setCustomId("dieSymbol")
    .setLabel(`Symbol: OS, SS, S, O`)
    .setStyle(TextInputStyle.Short)
    .setMinLength(1)
    .setMaxLength(2)
    .setPlaceholder("OS")
    .setRequired(true);

  const actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
    dieTypeInput
  );
  const nextActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
    dieValueInput
  );

  modal.addComponents(actionRow, nextActionRow);

  await interaction.showModal(modal);
};
