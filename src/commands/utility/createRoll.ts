import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { Roll } from "../../helpers/diceUtils";
import rollData from "../../handlers/rollDataStore";
import {
  rollButtonRowFactory,
  rollEmbedMaker,
} from "../../helpers/rollEmbedMaker";

export const data = new SlashCommandBuilder()
  .setName("roll")
  .setDescription("Declare assistance and void points before rolling!")
  .addNumberOption((option) =>
    option
      .setName("ring")
      .setDescription("Your ring value in the approach.")
      .setRequired(true)
  )
  .addNumberOption((option) =>
    option
      .setName("skill")
      .setDescription("Your skill ranks.")
      .setRequired(true)
  )
  .addBooleanOption((option) =>
    option
      .setName("voidpoint")
      .setDescription("Using a voidpoint?")
      .setRequired(false)
  )
  .addNumberOption((option) =>
    option
      .setName("skillassist")
      .setDescription("How much skilled assistance do you have?")
      .setRequired(false)
  )
  .addNumberOption((option) =>
    option
      .setName("unskillassist")
      .setDescription("How much unskilled assistance do you have?")
      .setRequired(false)
  );

export const execute = async (interaction: CommandInteraction) => {
  const user = interaction.user;
  const ring = interaction.options.get("ring", true).value as number;
  const skill = interaction.options.get("skill", true).value as number;
  const voidpoint =
    (interaction.options.get("voidpoint", false)?.value as boolean) || false;
  const skillAssist =
    (interaction.options.get("skillassist", false)?.value as number) || 0;
  const unskillAssist =
    (interaction.options.get("unskillassist", false)?.value as number) || 0;
  const roll = new Roll(ring, skill, voidpoint, unskillAssist, skillAssist);
  const rollDataKey = `${user.id}-${Math.floor(Math.random() * 1000)}`;
  rollData[rollDataKey] = roll;
  const resultString = roll.getStringResults().join("");
  const actionRow = rollButtonRowFactory(rollDataKey);
  const rollEmbed = rollEmbedMaker(
    interaction.member?.user?.username || user.displayName,
    user.displayAvatarURL(),
    interaction.client.user?.displayAvatarURL(),
    roll
  );
  await interaction.reply({
    content: `${resultString}`,
    embeds: [rollEmbed],
    components: [actionRow],
  });
};

module.exports = {
  data,
  execute,
};
