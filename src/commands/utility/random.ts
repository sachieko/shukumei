import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { MessageFlags } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("random")
  .setDescription("How many sides do you want the dice to have?")
  .addNumberOption((option) =>
    option
      .setName("sides")
      .setDescription("Number of sides on the dice.")
      .setRequired(true)
      .setMinValue(2)
      .setMaxValue(1000000),
  )
  .addStringOption((option) =>
    option.setName("label").setDescription("Label").setRequired(false),
  )
  .addBooleanOption((option) =>
    option
      .setName("hide")
      .setDescription("Hide result from others?")
      .setRequired(false),
  );

export const execute = async (interaction: ChatInputCommandInteraction) => {
  try {
    const user = interaction.user;
    const sides = interaction.options.getNumber("sides", true);
    const label =
      interaction.options.getString("label", false) ?? "Roll Result:";
    const hide = interaction.options.getBoolean("hide", false) ?? false;
    const timeEntropy = (Date.now() % 1000) / 1000;
    const entropicRoll = (Math.random() + timeEntropy) % 1;
    const result = Math.floor(entropicRoll * sides) + 1;
    const resultString = `(${user.toString()} Random) ${label}: ${result}`;
    await interaction.reply({
      content: `${resultString}`,
      flags: hide ? MessageFlags.Ephemeral : undefined,
    });
  } catch (error) {
    console.error(error);
    interaction.reply({
      content: "An error of fate occurred! Dev: This occured in random",
      flags: MessageFlags.Ephemeral,
    });
  }
};

module.exports = {
  data,
  execute,
};
