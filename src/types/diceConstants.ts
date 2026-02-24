export type DieType = "D6" | "D12";
export type State = number;
export const UNSET = 0; // A dice with this value has not been set
export interface RollState {
  [key: string]: number;
}
export const STATE = {
  AWAIT: 1,
  KEPT: 2,
  REROLLED: 3,
  ADDED: 4,
  FINAL: 5,
  MODDED: 6,
};
export const SOURCE_EMOJI = {
      base: "",
      assistance: "🤝🏽",
      void: "🌀",
      bonus: "🪭",
      explode: "💢",
      modded: "⤵️"
    }
export const D6: DieType = "D6";
export const D12: DieType = "D12";
export const BASE = "base";
export const ASSISTANCE = "assistance";
export const VOID = "void";
export const BONUS = "bonus";
export const EXPLODE = "explode";
export const MODDED = "modded";
export type DieSource =
  | typeof BASE
  | typeof ASSISTANCE
  | typeof VOID
  | typeof BONUS
  | typeof EXPLODE
  | typeof MODDED;
export const NEWROLL = 0;
// Discord emoji records
export const DISCORD_DIE_EMOJI = {
  D6: {
    1: "<:blackb:1381268338071699527>", // blank
    2: "<:blackos:1380603664892428298>", // opp  strife
    3: "<:blacko:1380603530804465764>", // opp
    4: "<:blacksst:1380603516804137040>", // success strife
    5: "<:blacks:1380603663659302923>", // success
    6: "<:blackexpst:1380603521686307027>", // exp strife
  } as EmojiSymbols,
  D12: {
    1: "<:whiteb:1380603524529917972>", // blank
    2: "<:whiteb:1380603524529917972>", // blank
    3: "<:whiteo:1380603526090330152>", // opp
    4: "<:whiteo:1380603526090330152>", // opp
    5: "<:whiteo:1380603526090330152>", // opp
    6: " <:whitesst:1380603522969633000>", // success strife
    7: " <:whitesst:1380603522969633000>", /// success strife
    8: "<:whites:1380603518745837689>", // success
    9: "<:whites:1380603518745837689>", // success
    10: "<:whiteso:1380603520209653953>", // success opp
    11: "<:whiteexpst:1380603512727146747>", // explosive strife
    12: "<:whiteex:1380603527314804776>", // explosive
  } as EmojiSymbols,
};

export const DISCORD_KEPT_EMOJI = {
  // see above
  D6: {
    1: "<:blackbk:1381351122005921872>",
    2: "<:blackostk:1381351123666993303>",
    3: "<:blackok:1381351126355673240>",
    4: "<:blacksstk:1381351128985374811>",
    5: "<:blacksk:1381351132298743828>",
    6: "<:blackexpstk:1381351130432409630>",
  } as EmojiSymbols,
  D12: {
    1: "<:whitebk:1381351084056121395>",
    2: "<:whitebk:1381351084056121395>",
    3: "<:whiteok:1381351082479058994>",
    4: "<:whiteok:1381351082479058994>",
    5: "<:whiteok:1381351082479058994>",
    6: "<:whitesstk:1381351078200737812>",
    7: "<:whitesstk:1381351078200737812>",
    8: "<:whitesk:1381351075235500073>",
    9: "<:whitesk:1381351075235500073>",
    10: "<:whiteosk:1381351076715823174>",
    11: "<:whiteexstk:1381351067702530049>",
    12: "<:whiteexk:1381351080524382291>",
  } as EmojiSymbols,
};

export const DICE_TRACKER_EMOJI: EmojiSymbols = {
    0: "🔟",
    1: "1️⃣",
    2: "2️⃣",
    3: "3️⃣",
    4: "4️⃣",
    5: "5️⃣",
    6: "6️⃣",
    7: "7️⃣",
    8: "8️⃣",
    9: "9️⃣",
}

// This emoji is for shaming those who unkeep dice because it's a mistake.
// Which is actually useful because GMs in play-by-play may need to keep track of abuse of unkeeping and keeping explosives repeatedly.
export const SHAME_EMOJI = "<:sadcat:1246356985826377779>";
export const STRIFE = "<:strife:1380611106417934376>";
export const SUCCESS = "<:success:1452177745240129627>"
export const OPPORTUNITY = "<:opportunity:1452177695348756610>";

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
  source: "base" | "assistance" | "void" | "bonus" | "modded";
}

export const D6_SYMBOLS: Record<number, DieSymbols> = {
  1: { success: false, opportunity: false, strife: false, explosive: false }, // Blank
  2: { success: false, opportunity: true, strife: true, explosive: false }, // Opp Strife
  3: { success: false, opportunity: true, strife: false, explosive: false }, // Opp
  4: { success: true, opportunity: false, strife: true, explosive: false }, // Success Strife
  5: { success: true, opportunity: false, strife: false, explosive: false }, // Success
  6: { success: true, opportunity: false, strife: true, explosive: true }, // Exp Strife
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
// For converting user input text which represents the above symbols into their respective value
export interface DieValue {
  OS: number;
  S: number;
  O: number;
  SS: number;
  ES: number;
  E: number;
}
interface SymbolToValue {
  D6: DieValue;
  D12: DieValue;
}

export const SYMBOL_TO_VALUE: SymbolToValue = {
  D6: {
    OS: 2,
    S: 5,
    O: 3,
    SS: 4,
    E: 6,
    ES: 6
  },
  D12: {
    OS: 10,
    S: 8,
    O: 3,
    SS: 6,
    E: 12,
    ES: 11
  },
};

export const EXPIRY_IN_DAYS = 14;
