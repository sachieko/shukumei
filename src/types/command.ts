import {
  CommandInteraction,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
  SlashCommandOptionsOnlyBuilder
} from "discord.js";

export default interface Command {
  data:
    | SlashCommandBuilder | SlashCommandOptionsOnlyBuilder
    | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
    | SlashCommandSubcommandsOnlyBuilder;
  /** The function to execute when the command is called */
  execute: (interaction: CommandInteraction) => Promise<unknown>;
}
