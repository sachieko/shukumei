import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import { Roll } from "./diceUtils";
import { STRIFE, OPPORTUNITY, SUCCESS, STATE } from "../types/diceConstants";
const AWAITCOLOR = "#FF06BD";
const FINALCOLOR = "#21FF3A";

export const rollEmbedMaker = (
  displayName: string,
  userAvatarURL: string,
  botAvatarURL: string,
  roll: Roll
) => {
  const embedObject = new EmbedBuilder()
    .setTitle(`${roll.getLabel()}`)
    .setThumbnail(userAvatarURL)
    .setAuthor({
      name: displayName,
      iconURL: botAvatarURL,
    })
    .setDescription(
      `${SUCCESS}${roll.getSuccesses()}  ${OPPORTUNITY}${roll.getOpportunities()}  ${STRIFE}${roll.getStrife()}`
    );
  embedObject
    .setColor(`${roll.getState() === STATE.FINAL ? FINALCOLOR : AWAITCOLOR}`)
    .addFields(
      {
        name: "Kept",
        value: `${roll.getKeptDie()}/${roll.getKeptLimit()}`,
        inline: true,
      },
      {
        name: "Ring/Skill",
        value: `${roll.getRingDice()}/${roll.getSkillDice()}`,
        inline: true,
      },
      {
        name: "Rerolls",
        value: `🔁 ${roll.getRerolls()}`,
        inline: true,
      }
    )
    .addFields(
      {
        name: "Status",
        value: `${
          roll.getState() === STATE.FINAL
            ? "✅ " + roll.getStateString()
            : "🤔 " + roll.getStateString()
        }`,
        inline: true,
      },
      {
        name: "Modifiers",
        value: `${roll.getSourceStrings().join("")}`,
        inline: true,
      }
    )
    .setFooter({
      text: `TN: ${roll.getTN()}${
        roll.getState() === STATE.FINAL
          ? ` VS ${roll.getSuccesses()} Successes`
          : ""
      }`,
    });
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
    .setLabel("Add Die")
    .setStyle(ButtonStyle.Danger);
  const modButton = new ButtonBuilder()
    .setCustomId(`roll-mod-${rollIdentifier}`)
    .setLabel("Modify")
    .setStyle(ButtonStyle.Primary);
  const finalizeButton = new ButtonBuilder()
    .setCustomId(`roll-final-${rollIdentifier}`)
    .setLabel("Done")
    .setStyle(ButtonStyle.Success);
  const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents([
    keepButton,
    rerollButton,
    addKeptButton,
    modButton,
    finalizeButton,
  ]);
  return buttonRow;
};
