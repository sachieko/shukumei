import {
  ButtonBuilder,
  CommandInteraction,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonStyle,
} from "discord.js";
import { stances } from "../../stances";
// import { activePredicts } from "../../app";

export const data = new SlashCommandBuilder()
  .setName("predict")
  .setDescription("What stance do you anticipate the other will take?")
  .addUserOption((option) =>
    option.setName("target").setDescription("The target of predict").setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("predict")
      .setDescription("What stance do you anticipate they will take?")
      .setRequired(true)
      .addChoices(
        { name: stances.earth.label, value: stances.earth.value },
        { name: stances.air.label, value: stances.air.value },
        { name: stances.water.label, value: stances.water.value },
        { name: stances.fire.label, value: stances.fire.value }
      )
  );

export const execute = async (interaction: CommandInteraction) => {
  const target = interaction.options.get("target");
  if (!target?.user) {
    return;
  }
  const targetId = target.user.id;
  const select = new ButtonBuilder()
    .setCustomId("stance")
    .setLabel("Select Stance")
    .setStyle(ButtonStyle.Primary);

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(select);

  return interaction.reply({
    content: `A prediction for <@${targetId}>'s stance has been set, choose your stance at the start of your next turn.`,
    components: [row],
  });
};

module.exports = {
  data,
  execute
}
