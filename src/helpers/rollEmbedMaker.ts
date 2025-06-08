import { CommandInteraction, EmbedBuilder } from "discord.js";
import { Roll } from "./diceUtils";
import { STRIFE, OPPORTUNITY, SUCCESS } from "../types/diceConstants";
export const rollEmbedMaker = (interaction: CommandInteraction, roll: Roll) => {
  const embedObject = new EmbedBuilder()
    .setTitle(`${interaction.user.username}'s Roll`)
    .setThumbnail(interaction.user.displayAvatarURL())
    .setAuthor({
      name: "Shukumei",
      iconURL: interaction.client.user?.displayAvatarURL(),
    })
    .setDescription(`${roll.getStringResults()}`);
  embedObject.setColor("#eb4034").addFields(
    {
      name: "Results",
      value: `${SUCCESS}${roll.getSuccesses()} | ${OPPORTUNITY}}${roll.getOpportunities()} | ${STRIFE}${roll.getStrife()}`,
      inline: true,
    },
    {
      name: "Modifiers",
      value: `${roll.getSourceStrings().join("")}`,
      inline: true,
    },
    
  );
  return embedObject;
};
