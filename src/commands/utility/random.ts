import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { MessageFlags } from "discord.js";
const MAXIMUMINT = 1000000;
const MININT = 2; // Dice with less than 2 sides not worth rolling
const MINDICE = 1; // Can't roll less than 1 die
const MAXDICE = 100; // I can't foresee why the hell anyone would roll more than 20 at most but sure, 100.

export const data = new SlashCommandBuilder()
  .setName("random")
  .setDescription("How many sides do you want the dice to have?")
  .addNumberOption((option) =>
    option
      .setName("sides")
      .setDescription("Number of sides on the dice.")
      .setRequired(true)
      .setMinValue(MININT)
      .setMaxValue(MAXIMUMINT),
  )
  .addNumberOption((option) =>
    option
      .setName("dice")
      .setDescription("Number of dice to roll.")
      .setRequired(false)
      .setMinValue(MINDICE)
      .setMaxValue(MAXDICE),
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
    const dice = interaction.options.getNumber("dice", false) ?? MINDICE;
    const label =
      interaction.options.getString("label", false) ?? "Roll Result";
    const hide = interaction.options.getBoolean("hide", false) ?? false;
    let results = "";
    let sum = 0;
    for (let i = 0; i < dice; i++) {
      const timeEntropy = (Date.now() % 1000) / 1000;
      const entropicRoll = (Math.random() + timeEntropy) % 1;
      const roll = Math.floor(entropicRoll * sides) + 1;
      results += `${roll} `;
      sum += roll;
    }
    const resultString = `(${user.toString()} Rolled ${dice}d${sides})${label}: ${results}. Total: ${sum}`;
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
