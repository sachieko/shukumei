import { Events } from "discord.js";
import { createEventListener } from "../types/eventListener";
import stringSelectMenuHandler from "../handlers/stringSelectMenu";
import chatInputCommandHandler from "../handlers/chatInputCommand";
import modalSubmitHandler from "../handlers/modalSubmit";
import buttonSubmit from "../handlers/buttonSubmit";

const event = createEventListener({
  name: Events.InteractionCreate,
  once: false,
  execute: async (interaction) => {
    if (interaction.isChatInputCommand()) {
      chatInputCommandHandler.handle(interaction);
    } else if (interaction.isStringSelectMenu()) {
      stringSelectMenuHandler.handle(interaction);
    } else if (interaction.isModalSubmit()) {
      modalSubmitHandler.handle(interaction);
    } else if (interaction.isButton()) {
      buttonSubmit.handle(interaction);
    } else {
      console.error(`Unknown interaction (type ${interaction.type})`);
    }
  },
});

module.exports = event;
