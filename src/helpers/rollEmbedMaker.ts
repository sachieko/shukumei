import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import { Roll } from "./diceUtils";
import {
  STRIFE,
  OPPORTUNITY,
  SUCCESS,
  STATE,
  EMBED_EMOJI,
} from "../types/diceConstants";
const AWAITCOLOR = "#06daff";
const KEPTCOLOR = "#ddff00";
const REROLLCOLOR = "#0627ff";
const MODCOLOR = "#ffffff";
const FINALCOLOR = "#006008";
const SUCCESSCOLOR = "#00dd1a";
const FAILCOLOR = "#da003a";

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

const shortOrBonus = (tn: number | "?" | undefined, successes: number, state: number) => {
  if (state !== STATE.FINAL) {
    return "- Roll not finished."
  }
  if (!tn || tn === "?") {
    return "- Hidden TN";
  }
  const difference = successes - Number(tn);
  if (difference > 0) {
    return `- Success with ${difference} Bonus 成功`;
  }
  if (difference === 0) {
    return "- Success 成功";
  } 
  return `- Failure with ${-difference} Shortfall 失敗`;
};

export const rollEmbedMaker = (
  displayName: string,
  userAvatarURL: string,
  roll: Roll,
) => {
  const embedObject = new EmbedBuilder()
    .setTitle(`${roll.getLabel()}`)
    .setAuthor({
      name: displayName,
    })
    .setThumbnail(userAvatarURL)
    .setDescription(
      `${SUCCESS}${roll.getSuccesses()}  ${OPPORTUNITY}${roll.getOpportunities()}  ${STRIFE}${roll.getStrife()}
      TN${roll.getTN()} ${shortOrBonus(roll.getTN(), roll.getSuccesses(), roll.getState())}`,
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
        name: "R/S",
        value: `${roll.getRingDice()}/${roll.getSkillDice()}`,
        inline: true,
      },
      {
        name: "Assist U/S",
        value: `${EMBED_EMOJI.uAssist}${roll.getUAssists()}/${EMBED_EMOJI.sAssist}${roll.getSAssists()}${roll.getVoid() ? ` ${EMBED_EMOJI.void}Void` : EMBED_EMOJI.blank}`,
        inline: true,
      },
    )
    .addFields({
      name: "Log",
      value: `${roll.getLog().slice(0, 1024)}`, // The field cannot exceed 1024 characters due to discord API.
      inline: true,
    })
    .setTimestamp(new Date());
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
