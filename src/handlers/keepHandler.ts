import { ButtonInteraction, CacheType, ModalBuilder,  TextInputBuilder, TextInputStyle,  ActionRowBuilder } from "discord.js";

export const keepHandler = async(interaction: ButtonInteraction<CacheType>) => {
  const rollDataKey = interaction.customId.replace("roll-keep-", "");
  const modal = new ModalBuilder()
      .setCustomId(`rollkeep-modal-${rollDataKey}`)
      .setTitle("Keep Dice");
  
    const dieIndexInput = new TextInputBuilder()
      .setCustomId("keepIndex")
      .setLabel("Enter numbers of the dice.")
      .setStyle(TextInputStyle.Short)
      .setMinLength(1)
      .setMaxLength(15)
      .setPlaceholder("1235")
      .setRequired(true);
  
    const actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
      dieIndexInput
    );
    modal.addComponents(actionRow);
  
    await interaction.showModal(modal);
};
