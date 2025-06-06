export const D6 = "D6";
export const D12 = "D12";
export const BASE = "base";
export const ASSISTANCE = "assistance";
export const VOID = "void";
export const BONUS = "bonus";
export const EXPLODE = "explode"
export const NEWROLL = 0;
export type DieType = "D6" | "D12";
export type DieSource = typeof BASE | typeof ASSISTANCE | typeof VOID |  typeof BONUS | typeof EXPLODE

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