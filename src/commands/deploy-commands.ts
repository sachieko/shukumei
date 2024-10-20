import { REST, Routes } from "discord.js";
import { config } from "../config";
import { commands } from "./index";

const commandsData = Object.values(commands).map((command) => command.data);

const rest = new REST().setToken(config.DISCORD_BOT_TOKEN);

export const deployCommands = async () => {
  try {
    console.log(
      "Requesting politely a refresh of application (/) commands from the Magistrates.."
    );

    await rest.put(
      Routes.applicationGuildCommands(config.APP_ID, config.GUILD_ID),
      {
        body: commandsData,
      }
    );

    console.log("The Magistrates have approved the (/) commands.");
  } catch (error) {
    console.error(error);
  }
};

export const deleteCommands = async (guildId?: string) => {
  try {
    console.log("Requesting all heretical elements (/) be purged.");
    // Use my default guild ID if not specified
    await rest
      .put(
        Routes.applicationGuildCommands(
          config.APP_ID,
          guildId || config.GUILD_ID
        ),
        { body: [] }
      )
      .then(() => console.log("Owari."))
      .catch(console.error);
  } catch (error) {
    console.error(error);
  }
};
