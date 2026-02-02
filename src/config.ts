import dotenv from "dotenv";
dotenv.config();
const { BOT_TOKEN, PUBLIC_KEY, APP_ID, GUILD_ID, GMTOFFSET } = process.env;

if (!BOT_TOKEN || !PUBLIC_KEY || !APP_ID || !GUILD_ID || !GMTOFFSET) {
  throw new Error("Missing Env Variables");
}

export const config = {
  DISCORD_BOT_TOKEN: BOT_TOKEN,
  APP_ID,
  PUBLIC_KEY,
  GUILD_ID,
  GMTOFFSET
};