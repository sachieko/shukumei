export const D6 = "D6";
export const D12 = "D12";
export const BASE = "base";
export const ASSISTANCE = "assistance";
export const VOID = "void";
export const BONUS = "bonus";
export const EXPLODE = "explode";
export const NEWROLL = 0;
export type DieType = "D6" | "D12";
export type DieSource =
  | typeof BASE
  | typeof ASSISTANCE
  | typeof VOID
  | typeof BONUS
  | typeof EXPLODE;

export const DISCORD_EMOJI = {
  D6: {
    1: "<:blackb:1380603514446938193>",
    2: "<:blackos:1380603664892428298>",
    3: "<:blacko:1380603530804465764>",
    4: "<:blacksst:1380603516804137040>",
    5: "<:blacks:1380603663659302923>",
    6: "<:blackexpst:1380603521686307027>",
  } as EmojiSymbols,
  D12: {
    1: "<:whiteb:1380603524529917972>",
    2: "<:whiteb:1380603524529917972>",
    3: "<:whiteo:1380603526090330152>",
    4: "<:whiteo:1380603526090330152>",
    5: "<:whiteo:1380603526090330152>",
    6: " <:whitesst:1380603522969633000>",
    7: " <:whitesst:1380603522969633000>",
    8: "<:whites:1380603518745837689>",
    9: "<:whites:1380603518745837689>",
    10: "<:whiteso:1380603520209653953>",
    11: "<:whiteexpst:1380603512727146747>",
    12: "<:whiteex:1380603527314804776>",
  } as EmojiSymbols,
};

export const STRIFE = "<:strife:1380611106417934376>";

export interface DieSymbols {
  success: boolean;
  opportunity: boolean;
  strife: boolean;
  explosive: boolean;
}

export interface EmojiSymbols {
  [key: number]: string;
}

export interface Dice {
  type: "D6" | "D12";
  value: number;
  kept: boolean;
  rerolled: boolean;
  source: "base" | "assistance" | "void" | "bonus";
}

// These values represent the explosive faces.
export const D6_EXP = 6;
export const D12_EXP = 12;
export const D12_EXP2 = 11;

export const D6_SYMBOLS: Record<number, DieSymbols> = {
  1: { success: false, opportunity: false, strife: false, explosive: false }, // Blank
  2: { success: false, opportunity: true, strife: true, explosive: false }, // Opp Strife
  3: { success: false, opportunity: true, strife: false, explosive: false }, // Opp
  4: { success: true, opportunity: false, strife: true, explosive: false }, // Success Strife
  5: { success: true, opportunity: false, strife: false, explosive: false }, // Success
  6: { success: true, opportunity: false, strife: false, explosive: true }, // Exp Strife
};

export const D12_SYMBOLS: Record<number, DieSymbols> = {
  1: { success: false, opportunity: false, strife: false, explosive: false }, // Blank
  2: { success: false, opportunity: false, strife: false, explosive: false }, // Blank
  3: { success: false, opportunity: true, strife: false, explosive: false }, // Opp
  4: { success: false, opportunity: true, strife: false, explosive: false }, // Opp
  5: { success: false, opportunity: true, strife: false, explosive: false }, // Opp
  6: { success: true, opportunity: false, strife: true, explosive: false }, // Success Strife
  7: { success: true, opportunity: false, strife: true, explosive: false }, // Success Strife
  8: { success: true, opportunity: false, strife: false, explosive: false }, // Success
  9: { success: true, opportunity: false, strife: false, explosive: false }, // Success
  10: { success: true, opportunity: true, strife: false, explosive: false }, // Success Opp
  11: { success: true, opportunity: false, strife: true, explosive: true }, // Exp Strife
  12: { success: true, opportunity: false, strife: false, explosive: true }, // Exp
};
