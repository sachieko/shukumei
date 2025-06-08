import { ButtonInteraction, CacheType, ModalBuilder,  TextInputBuilder, TextInputStyle,  ActionRowBuilder } from "discord.js";

export const rerollHandler = async(interaction: ButtonInteraction<CacheType>) => {
  const rollDataKey = interaction.customId.replace("roll-reroll-", "");
  const modal = new ModalBuilder()
      .setCustomId(`rollreroll-modal-${rollDataKey}`)
      .setTitle("Reroll Dice");
  
    const dieIndexInput = new TextInputBuilder()
      .setCustomId("rollIndex")
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
