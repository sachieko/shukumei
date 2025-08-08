import {
  SlashCommandBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  CollectorFilter,
  EmbedBuilder,
  ChatInputCommandInteraction
} from "discord.js";
import Command from "../../types/command";
import { Stances, stances } from "../../types/stances";

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

  execute: async (interaction: ChatInputCommandInteraction) => {
    const target = interaction.options.getUser("target", true);
    const targetId = target.id;
    const predictedStance = interaction.options.getString("predict", true);
    const userId = interaction.user.id;
    if (!target) {
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
      content: `A prediction for <@${targetId}>'s stance has been set, waiting for them to choose a stance.`,
      components: [row],
    });
    // Only the chosen user should be able to interact.
    const collectorFilter: CollectorFilter<any> = (i: any) =>
      i.user.id === targetId;
    try {
      const selection = await response.awaitMessageComponent({
        filter: collectorFilter,
        time: 86400_000,
      });
      const embedObject = new EmbedBuilder()
        .setTitle("Prediction Resolved")
        .setThumbnail(interaction.user.displayAvatarURL())
        .setAuthor({
          name: "Shukumei",
          iconURL: interaction.client.user?.displayAvatarURL(),
        })
        .setDescription(
          `<@${userId}> predicted that <@${targetId}> will enter ${predictedStance} stance.`
        );
      if (
        selection.isStringSelectMenu() && // makes TS happy about selection.values existing
        predictedStance === selection.values[0]
      ) {
        const prediction = predictedStance as keyof Stances;
        const stance = selection.values[0] as keyof Stances;
        embedObject.setColor("#eb4034").addFields(
          {
            name: "Prediction",
            value: `${stances[prediction].label}`,
            inline: true,
          },
          {
            name: "Choice",
            value: `${stances[stance].label}`,
            inline: true,
          },
          {
            name: "Result",
            value: `<@${targetId}> gains 4 strife and must enter a stance other than ${stances[prediction].label}.`,
            inline: false,
          }
        );
        await interaction.editReply({
          content: "",
          embeds: [embedObject],
          components: [],
        });
        return;
      }
      if (selection.isStringSelectMenu() && predictedStance) {
        const prediction = predictedStance as keyof Stances; // These values strictly match the keys due to choices on the slash command
        const stance = selection.values[0] as keyof Stances; // These values strictly will match the keys due to options
        embedObject.setColor("#42f584").addFields(
          {
            name: "Prediction",
            value: `${stances[prediction].label}`,
            inline: true,
          },
          {
            name: "Choice",
            value: `${stances[stance].label}`,
            inline: true,
          },
          {
            name: "Result",
            value: `<@${targetId}> enters ${stances[stance].label}.`,
            inline: false,
          }
        );
        await interaction.editReply({
          content: "",
          embeds: [embedObject],
          components: [],
        });
      }
    } catch (error) {
      await interaction.editReply({ content: "An error occurred while waiting for the prediction response." });
      console.error(error);
    }
  },
};

module.exports = command;
