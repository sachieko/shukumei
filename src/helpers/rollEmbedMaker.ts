import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import { Roll } from "./diceUtils";
import { STRIFE, OPPORTUNITY, SUCCESS, AWAIT } from "../types/diceConstants";
const AWAITCOLOR = "#FF06BD";
const FINALCOLOR = "#21FF3A";

export const rollEmbedMaker = (
  displayName: string,
  userAvatarURL: string,
  botAvatarURL: string,
  roll: Roll
) => {
  const embedObject = new EmbedBuilder()
    .setTitle(`${displayName}'s Roll Results`)
    .setThumbnail(userAvatarURL)
    .setAuthor({
      name: "Shukumei",
      iconURL: botAvatarURL,
    })
    .setDescription(
      `${SUCCESS}${roll.getSuccesses()} | ${OPPORTUNITY}${roll.getOpportunities()} | ${STRIFE}${roll.getStrife()}`
    );
  embedObject
    .setColor(`${roll.getState() === AWAIT ? AWAITCOLOR : FINALCOLOR}`)
    .addFields(
      {
        name: "Modifiers",
        value: `${roll.getSourceStrings().join("")}`,
        inline: true,
      },
      {
        name: "Keep Limit",
        value: `${roll.getKeptLimit()}`,
        inline: true,
      },
      {
        name: "Rerolls",
        value: `${roll.getRerolls()}`,
        inline: true,
      },
      {
        name: "Status",
        value: `${roll.getStateString()}`,
        inline: false,
      }
    );
  return embedObject;
};

export const rollButtonRowFactory = (rollIdentifier: string) => {
  const keepButton = new ButtonBuilder()
    .setCustomId(`roll-keep-${rollIdentifier}`)
    .setLabel("Keep")
    .setStyle(ButtonStyle.Primary);
  const rerollButton = new ButtonBuilder()
    .setCustomId(`roll-reroll-${rollIdentifier}`)
    .setLabel("Reroll")
    .setStyle(ButtonStyle.Danger);
  const addKeptButton = new ButtonBuilder()
    .setCustomId(`roll-add-${rollIdentifier}`)
    .setLabel("Add Kept")
    .setStyle(ButtonStyle.Danger);
  const finalizeButton = new ButtonBuilder()
    .setCustomId(`roll-final-${rollIdentifier}`)
    .setLabel("Done")
    .setStyle(ButtonStyle.Success);
  const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents([
    keepButton,
    rerollButton,
    addKeptButton,
    finalizeButton,
  ]);
  return buttonRow;
};
