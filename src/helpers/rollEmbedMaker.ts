import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import { Roll } from "./diceUtils";
import { STRIFE, OPPORTUNITY, SUCCESS, STATE } from "../types/diceConstants";
const AWAITCOLOR = "#06daffff";
const KEPTCOLOR = "#ddff00ff";
const REROLLCOLOR = "#0627ffff";
const MODCOLOR = "#ffffffff";
const FINALCOLOR = "#006008ff";
const SUCCESSCOLOR = "#00dd1aff";
const FAILCOLOR = "#da003aff";

// Returns a color depending on state and if a TN is given
const colorPicker = (
  tn: number | "?" | undefined,
  successes: number,
  state: number,
) => {
  if (state === STATE.AWAIT) {
    return AWAITCOLOR;
  }
  if (state === STATE.KEPT) {
    return KEPTCOLOR;
  }
  if (state === STATE.REROLLED) {
    return REROLLCOLOR;
  }
  if (state === STATE.MODDED || state === STATE.ADDED) {
    return MODCOLOR;
  }
  if (state === STATE.FINAL && tn && tn !== "?") {
    return successes >= tn ? SUCCESSCOLOR : FAILCOLOR;
  }
  return FINALCOLOR;
};

export const rollEmbedMaker = (
  displayName: string,
  userAvatarURL: string,
  botAvatarURL: string,
  roll: Roll,
) => {
  const embedObject = new EmbedBuilder()
    .setTitle(`${roll.getLabel()}`)
    .setThumbnail(userAvatarURL)
    .setAuthor({
      name: displayName,
      iconURL: botAvatarURL,
    })
    .setDescription(
      `${SUCCESS}${roll.getSuccesses()}  ${OPPORTUNITY}${roll.getOpportunities()}  ${STRIFE}${roll.getStrife()}`,
    );
  embedObject
    .setColor(colorPicker(roll.getTN(), roll.getSuccesses(), roll.getState()))
    .addFields(
      {
        name: "Kept",
        value: `${roll.getKeptDice()}/${roll.getKeptLimit()}${
          roll.getForceKept() > 0 ? ` (+${roll.getForceKept()})` : ""
        }`,
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
      },
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
      },
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
