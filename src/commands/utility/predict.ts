import {
  SlashCommandBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  CollectorFilter,
} from "discord.js";
import Command from "../../types/command";
import { stances } from "../../stances";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("predict")
    .setDescription("What stance do you anticipate the other will take?")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The target of predict")
        .setRequired(true)
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
    ),

  execute: async (interaction) => {
    const target = interaction.options.get("target");
    const targetId = target?.user?.id;
    const predict = interaction.options.get("predict");
    const userId = interaction.user.id;
    if (!target?.user) {
      return;
    }
    const select = new StringSelectMenuBuilder()
      .setCustomId("stance")
      .setPlaceholder("Select Stance")
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel(stances.earth.label)
          .setDescription(stances.earth.description)
          .setValue(stances.earth.value),
        new StringSelectMenuOptionBuilder()
          .setLabel(stances.air.label)
          .setDescription(stances.air.description)
          .setValue(stances.air.value),
        new StringSelectMenuOptionBuilder()
          .setLabel(stances.water.label)
          .setDescription(stances.water.description)
          .setValue(stances.water.value),
        new StringSelectMenuOptionBuilder()
          .setLabel(stances.fire.label)
          .setDescription(stances.fire.description)
          .setValue(stances.fire.value),
        new StringSelectMenuOptionBuilder()
          .setLabel(stances.void.label)
          .setDescription(stances.void.description)
          .setValue(stances.void.value)
      );

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      select
    );

    const response = await interaction.reply({
      content: `A prediction for <@${targetId}>'s stance has been set. <@${targetId}>: Choose your stance at the start of your next turn.`,
      components: [row],
    });
    // Only the chosen user should be able to interact.
    const collectorFilter: CollectorFilter<any> = (i: any) =>
      i.user.id === targetId;
    try {
      const selection = await response.awaitMessageComponent({
        filter: collectorFilter,
      });
      if (
        selection.isStringSelectMenu() &&
        predict?.value === selection.values[0]
      ) {
        await interaction.editReply({
          content: `<@${userId}> has correctly predicted that <@${targetId}> will enter ${predict.value} stance! <@${targetId}> gains 4 strife and enters a stance that is not ${predict.value}.`,
          components: [],
        });
      } else if (selection.isStringSelectMenu() && predict?.value) {
        await interaction.editReply({
          content: `<@${targetId}> entered ${selection.values[0]} stance, while <@${userId}> anticipated ${predict.value} stance.`,
          components: [],
        });
      }
    } catch (error) {
      await interaction.editReply({ content: "An error occurred." });
      console.error(error);
    }
  },
};

module.exports = {
  data: command.data,
  execute: command.execute,
};
