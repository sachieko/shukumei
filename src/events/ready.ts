import { createEventListener } from "../types/eventListener";
const { Events } = require('discord.js');

const event = createEventListener({
  name: Events.ClientReady,
  once: true,
  execute: async client => {
    if (client.user) console.log(`Ready! Logged in as ${client.user.tag}`);
  }
})

module.exports = event;

