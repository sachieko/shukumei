import { config } from "./config";
import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import { commands } from "./commands/index";
import { deployCommands } from "./commands/deploy-commands";
import * as fs from 'fs';
import * as path from 'path';

export const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

export const activePredicts = {};

client.once("ready", () => {
  console.log("Shukumei is ready to be received.");
});

// Deploy commands when added to a server
client.on("guildCreate", async (guild) => {
  await deployCommands();
});


client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }

  const { commandName } = interaction;

  if (commands[commandName as keyof typeof commands]) {
    await commands[commandName as keyof typeof commands].execute(interaction);
  }
});

client.login(config.DISCORD_BOT_TOKEN);
