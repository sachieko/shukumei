import { MessageFlags, ModalSubmitInteraction, EmbedBuilder } from "discord.js";
import bidData from "./bidDataStore";
import { fetchNickname } from "../helpers/fetchUtils";

const staredownModalHandler = async (interaction: ModalSubmitInteraction) => {
  const bidKey = interaction.customId.replace("staredown-modal-", "");
  const [initiatorId, targetId] = bidKey.split("-");
  // Parse number from string in case we want to make comparison logic in a future change.
  const responseBid = interaction.fields.getTextInputValue("bidAmount");
  const responseNumber = parseInt(responseBid, 10);
  if (isNaN(responseNumber) || responseNumber < 0 || responseNumber > 12) {
    await interaction.reply({
      content: "Please enter a valid number between 0 and your Focus.",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }
  const initialDisplayName = await fetchNickname(interaction, initiatorId);
  const responderDisplayName = await fetchNickname(interaction, targetId);
  const originalNumber = bidData[bidKey];
  delete bidData[bidKey];
  const embedObject = new EmbedBuilder()
    .setTitle("Staredown Summary")
    .setAuthor({
      name: "Shukumei",
      iconURL: interaction.client.user?.displayAvatarURL(),
    })
    .setDescription(`<@${initiatorId}> stares down <@${targetId}>.`);
  embedObject.setColor("#76C2E4").addFields(
    {
      name: `${initialDisplayName + "'s" || "Initiator's"} Bid`,
      value: `**${originalNumber}** strife`,
      inline: true,
    },
    {
      name: `${responderDisplayName + "'s" || "Responder's"} Bid`,
      value: `**${responseNumber}** strife`,
      inline: true,
    }
  );
  await interaction.message?.delete().catch(console.error);
  await interaction.reply({
    embeds: [embedObject],
    components: [],
  });
};

export default staredownModalHandler;
