import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
  CollectorFilter,
  TextInputBuilder,
  TextInputStyle,
  ModalBuilder,
} from "discord.js";
import Command from "../../types/command";
import { bidData } from "../../handlers/bidDataStore";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("staredown")
    .setDescription("Initiate the bidding of strife during the staredown.")
    .addIntegerOption((option) =>
      option
        .setName("bid")
        .setDescription("How much strife do you bid up to your Focus?")
        .setRequired(true)
        .setMaxValue(12)
        .setMinValue(0)
    )
    .addUserOption((option) =>
      option
        .setRequired(true)
        .setName("opponent")
        .setDescription("Your duel opponent.")
    ),

  execute: async (interaction) => {
    const target = interaction.options.get("opponent");
    const bid = interaction.options.get("bid");
    const user = interaction.user;
    if (!target?.user || !user || !bid) return; // exit if target isn't a valid user, user doesn't exist, or there is no bid
    const key = `${user.id}-${target.user.id}`
    const beginBidButton = new ButtonBuilder()
      .setCustomId("begin")
      .setLabel("Bid")
      .setStyle(ButtonStyle.Primary);

    const beginBidRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      beginBidButton
    );

    const beginBidResponse = await interaction.reply({
      content: `Waiting for <@${target.user.id} to bid for staredown:`,
      components: [beginBidRow],
    });

    const collectorFilter: CollectorFilter<any> = (i: any) =>
      i.user.id === target.user?.id;

    try {
      await beginBidResponse.awaitMessageComponent({
        filter: collectorFilter,
        time: 86400_000,
      });

      const oppBidInput = new TextInputBuilder()
        .setCustomId("oppbid")
        .setLabel("How much strife will you bid? (0 - Focus)")
        .setPlaceholder("0")
        .setStyle(TextInputStyle.Short);

      const modal = new ModalBuilder()
        .setCustomId("bidInputModal")
        .setTitle("Strife Bid");

      const bidActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(oppBidInput);
      modal.addComponents(bidActionRow);

      const bidInput = await interaction.showModal(modal)

      await interaction.editReply({});
    } catch (error) {}

    await interaction.reply({
      content: "An error occurred while waiting for a bid.",
    });
  },
};

module.exports = command;
