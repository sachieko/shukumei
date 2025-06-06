import {
  ActionRowBuilder,
  ButtonInteraction,
  MessageFlags,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

const diceInteractHandler = async (interaction: ButtonInteraction) => {
  const rollId = interaction.customId.replace("roll-", "");
  const [, userId] = rollId.split("-");

  // User validation
  if (interaction.user.id !== userId) {
    await interaction.reply({
      content: "Only the user who rolled can interact with the roll.",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  const modal = new ModalBuilder()
    .setCustomId(`die-interact-modal-${rollId}`)
    .setTitle("");

  const dieInteractInput = new TextInputBuilder()
    .setCustomId(`die-interact-resp-${rollId}`)
    .setLabel("")
    .setStyle(TextInputStyle.Short)
    .setMinLength(1);

  const actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(dieInteractInput);
  modal.addComponents(actionRow);

  await interaction.showModal(modal);
};

export default diceInteractHandler;
