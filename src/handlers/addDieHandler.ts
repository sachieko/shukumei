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

  const keptInput = new TextInputBuilder()
    .setCustomId("keptInput")
    .setLabel("K = Kept")
    .setStyle(TextInputStyle.Short)
    .setMinLength(0)
    .setMaxLength(1)
    .setPlaceholder("K")
    .setRequired(true);

  const dieValueInput = new TextInputBuilder()
    .setCustomId("dieSymbol")
    .setLabel(`Symbol: OS, SS, S, O, E, ES`)
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

  const keptActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
    keptInput
  );

  modal.addComponents(actionRow, nextActionRow, keptActionRow);

  await interaction.showModal(modal);
};
