import { config } from "../../config";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import Command from "../../types/command";
// GMT Offset

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("reminder")
    .setDescription("Create a timestamp reminder for next game day.")
    .addStringOption((option) =>
      option
        .setName("event")
        .setDescription("Name of what the reminder is for")
        .setRequired(true),
    )
    .addNumberOption((option) =>
      option
        .setName("day")
        .setDescription("Set the day of Month")
        .setRequired(true),
    )
    .addNumberOption((option) =>
      option
        .setName("hour")
        .setDescription("Set the hour in 24 hour time (ie 20 = 8:00 PM)")
        .setRequired(true),
    )
    .addNumberOption((option) =>
      option
        .setName("minutes")
        .setDescription("Optional: Set the minutes.")
        .setRequired(false),
    )
    .addNumberOption((option) =>
      option.setName("timezone").setDescription("Enter your timezone offset with +/-. ie: +5 or -8").setRequired(false),
    )
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription(
          "Optional: Choose a role to ping/mention in the message.",
        )
        .setRequired(false),
    ),

  execute: async (interaction: ChatInputCommandInteraction) => {
    const eventName = interaction.options.getString("event", true);
    const nextDate = new Date();
    const dayOfMonth = interaction.options.getNumber("day", true);
    let hour = interaction.options.getNumber("hour", true);
    const minutes = interaction.options.getNumber("minutes", false) ?? 0; // If minutes is not given, default to 0
    const timezoneOffset = interaction.options.getNumber("timezone", false);
    const roleToMention = interaction.options.getRole("role", false);
    // If the day of the month is less than the current day, the user wants the next day of the month.
    if (dayOfMonth < nextDate.getDate()) {
      nextDate.setMonth(nextDate.getMonth() + 1);
    }
    if (timezoneOffset) {
      hour += (timezoneOffset - Number(config.GMTOFFSET));
    }
    nextDate.setDate(Number(dayOfMonth));
    nextDate.setHours(Number(hour));
    nextDate.setMinutes(Number(minutes));
    // Discord timestamps do not use milliseconds so we remove them from the UTC timestamp
    const UTCstamp = `${
      (nextDate.getTime() - (nextDate.getTime() % 1000)) / 1000
    }`;
    const discordString = `${
      roleToMention?.toString() ?? ""
    } ${interaction.user.toString()} Set a timestamp for **${eventName}** <t:${UTCstamp}:R> , <t:${UTCstamp}:F>! This time is based on your local time.`;
    await interaction.reply(discordString);
  },
};
module.exports = command;
