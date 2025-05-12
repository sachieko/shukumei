import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
  CommandInteraction,
  MessageFlags,
} from "discord.js";
import Command from "../../types/command";
import bidData from "../../handlers/bidDataStore";

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

  execute: async (interaction: CommandInteraction) => {
    const target = interaction.options.get("opponent", true);
    const bid = interaction.options.get("bid", true).value;
    const user = interaction.user;
    // user validation
    if (target.user?.bot) {
      await interaction.reply({
        content: "You can't stare a bot down.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    if (target.user?.id === interaction.user.id) {
      // check if they chose themselves, and inform but allow interaction to continue
      // await interaction.reply({
      //   content: "You are staring yourself down.",
      //   flags: MessageFlags.Ephemeral,
      // });
    }
    if (!target?.user) {
      // valid user check
      await interaction.reply({
        content: "That user wasn't valid to staredown!",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    const bidKey = `${user.id}-${target.user.id}`;
    if (bidData[bidKey] !== undefined) {
      await interaction.reply({
        content:
          "There is already an active staredown between  you and that user.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    // Store staredown bid
    bidData[bidKey] = Number(bid);
    const beginBidButton = new ButtonBuilder()
      .setCustomId(`staredown-bid-${bidKey}`)
      .setLabel("Bid")
      .setStyle(ButtonStyle.Primary);
    // Create reply
    const beginBidRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      beginBidButton
    );

    await interaction.reply({
      content: `Waiting for <@${target.user.id}> to bid for staredown initiated by <@${user.id}>:`,
      components: [beginBidRow],
    });
  },
};

module.exports = command;
