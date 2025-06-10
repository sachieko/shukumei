import { REST, Routes } from "discord.js";
import { config } from "./config";
import Command from "./types/command";
import * as fs from "fs";
import * as path from "path";

const commands: Command[] = [];

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);
for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      commands.push(command.data.toJSON());
    } else {
      console.log(
        `[WARNING]: The command at ${filePath} is missing a required data or execute property.`
      );
    }
  }
}

const rest = new REST().setToken(config.DISCORD_BOT_TOKEN);

export const deployGuildCommands = async () => {
  try {
    console.log(
      "Requesting politely a refresh of application (/) commands from the Magistrates.."
    );
    // Put method refreshes all commands in the guild with the given set
    await rest.put(
      Routes.applicationGuildCommands(config.APP_ID, config.GUILD_ID),
      {
        body: commands,
      }
    );
    console.log("The Magistrates have approved the (/) commands.");
  } catch (error) {
    console.error(error);
  }
};

export const deleteCommands = async (guildId?: string) => {
  try {
    console.log("Requesting all heretical (/) elements be purged.");
    // Use my default guild ID here
    await rest
      .put(Routes.applicationGuildCommands(config.APP_ID, config.GUILD_ID), {
        body: [],
      })
      .then(() => console.log("Owari."))
      .catch(console.error);
  } catch (error) {
    console.error(error);
  }
};

export const deployCommands = async (clientId?: string) => {
  await rest.put(Routes.applicationCommands(config.APP_ID), { body: commands });
};
