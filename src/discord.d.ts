import type { Client } from "discord.js";
import Command from "./types/command";

declare module "discord.js" {
  export interface Client extends Client {
    commands: Collection<unknown, Command>;
  }
}
