import { Client, Events, GatewayIntentBits } from "discord.js";
import { config } from "./config";
import { commands } from "./commands/index";
import { deployCommands } from "./commands/deploy-commands";

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

// Log when client is ready.
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
    commands[commandName as keyof typeof commands].execute(interaction);
  }
});

client.login(config.DISCORD_BOT_TOKEN);
