import { MessageFlags, ButtonInteraction } from "discord.js";
import rollData from "./rollDataStore";
import { rollEmbedMaker } from "../helpers/rollEmbedMaker";
import { STATE } from "../types/diceConstants";
import { fetchNickname } from "../helpers/fetchUtils";

const finalRollHandler = async (interaction: ButtonInteraction) => {
  if (!interaction.channel || !interaction.message) {
    try {
      return await interaction.reply({
        content: "Error: Cannot locate the original message.",
        ephemeral: true,
      });
    } catch (err) {
      console.error(`Error in final roll handler: ${err}`)
    }
  }
  const user = interaction.user;
  const rollDataKey = interaction.customId.replace("roll-final-", "");
  const [userId] = rollDataKey.split("-");
  if (user.id !== userId) {
    await interaction.reply({
      content: "Only the one who created the roll can interact with it.",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }
  const roll = rollData[rollDataKey];
  if (!roll) {
    await interaction.reply({
      content: "This roll no longer exists, this most likely means the roll has been left uncompleted for too long or the bot went down while you were trying to finish the roll.",
      flags: MessageFlags.Ephemeral,
    })
    return; // Prevent crashes if the bot crashed and a user tries to interact with a discarded roll
  }
  //** In some cases, users need to keep 0 dice, and we can't check if the roller is compromised.
  //** Uncomment the below if statement if you want to force players to keep at least 1 die
  // if (roll.getKeptDice() === 0) {
  //   await interaction.reply({
  //     content: "Rolls must resolve with at least 1 kept die, see the core rulebook :)",
  //     flags: MessageFlags.Ephemeral,
  //   });
  //   return;
  // }
  const nickname = await fetchNickname(interaction);
  roll.setState(STATE.FINAL);
  const resultString = roll.getFinalDieStrings();
  const rollEmbed = rollEmbedMaker(
    nickname || user.displayName,
    user.displayAvatarURL(),
    interaction.client.user?.displayAvatarURL(),
    roll
  );
  try {
    await interaction.message.edit({
      content: `${resultString}`,
      embeds: [rollEmbed],
      components: [],
    });
    delete rollData[rollDataKey]; // clean up the mock db object only if editing message works.
  } catch (err) {
    interaction.reply({
      content: "Shukumei does not have permissions to interact with the message in this channel it seems. Make sure it is in the member list for this channel!",
      flags: MessageFlags.Ephemeral
    }
    )
  }
  await interaction.deferUpdate().catch(console.error);
};

export default finalRollHandler;
