import { createEventListener } from "../types/eventListener";
const { Events } = require("discord.js");
import cleanupData from "../helpers/cleanupData";

const event = createEventListener({
  name: Events.ClientReady,
  once: true,
  execute: async (client) => {
    if (client.user) console.log(`Ready! Logged in as ${client.user.tag}`);
    setInterval(cleanupData, 24 * 60 * 60 * 1000); // 24 hours
  },
});

module.exports = event;
