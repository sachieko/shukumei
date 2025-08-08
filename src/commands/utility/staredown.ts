import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  MessageFlags,
} from "discord.js";
import Command from "../../types/command";
import bidData from "../../handlers/bidDataStore";
import { fetchNickname } from "../../helpers/fetchUtils";

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

  execute: async (interaction: ChatInputCommandInteraction) => {
    const target = interaction.options.getUser("opponent", true);
    const bid = interaction.options.getNumber("bid", true);
    const user = interaction.user;
    const nickname = fetchNickname(interaction, user.id);
    const targetNickname = fetchNickname(interaction, target.id);
    // user validation
    if (target.bot) {
      await interaction.reply({
        content: "You can't stare a bot down.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    /* We allow users to target themselves, but may change this behavior in the future.
    if (target.user?.id === interaction.user.id) {
      
    }
    */
    if (!target) {
      // valid user check
      await interaction.reply({
        content: "That user wasn't valid to staredown!",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    const bidKey = `${user.id}-${target.id}`;
    if (bidData[bidKey] !== undefined) {
      await interaction.reply({
        content:
          "There is already an active staredown between you and that user.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    // Store staredown bid
    bidData[bidKey] = Number(bid);
    // fetch nicknames
    const beginBidButton = new ButtonBuilder()
      .setCustomId(`staredown-bid-${bidKey}`)
      .setLabel("Bid")
      .setStyle(ButtonStyle.Primary);
    // Create reply
    const beginBidRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      beginBidButton
    );

    await interaction.reply({
      content: `Waiting for **${targetNickname}** to bid for staredown initiated by **${nickname}**:`,
      components: [beginBidRow],
    });
  },
};

module.exports = command;
