import { deleteCommands } from "./commands/deploy-commands";
// Delete all commands in guild given a guild ID, or in my default guild if not specified
const guildId = process.argv[2];
deleteCommands(guildId);