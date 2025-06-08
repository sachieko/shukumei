import {
  DieSymbols,
  DieType,
  DieSource,
  DISCORD_DIE_EMOJI,
  DISCORD_KEPT_EMOJI,
  D6,
  D12,
  BASE,
  ASSISTANCE,
  VOID,
  NEWROLL,
  BONUS,
  EXPLODE,
  D6_SYMBOLS,
  D12_SYMBOLS,
  D6_EXP,
  D12_EXP,
  D12_EXP2,
} from "../types/diceConstants";

export class Die {
  readonly type: DieType;
  readonly source: DieSource;
  kept: boolean;
  rerolled: boolean;
  #value: number;
  #symbols: DieSymbols;

  constructor(
    type: DieType,
    value: number,
    {
      kept = false,
      rerolled = false,
      source = BASE,
    }: {
      kept?: boolean;
      rerolled?: boolean;
      source?: DieSource;
    } = {}
  ) {
    this.type = type;
    this.kept = kept;
    this.rerolled = rerolled;
    this.source = source;
    this.#value = value === 0 ? this.#rollDie() : value;
    this.#symbols = this.getSymbol();

    if (source === BONUS) {
      this.kept = true;
    }
  }

  #rollDie() {
    this.#value =
      this.type === D6
        ? Math.ceil(Math.random() * 6)
        : Math.ceil(Math.random() * 12);
    this.#symbols = this.getSymbol();
    return this.#value;
  }

  reroll() {
    this.#rollDie();
    this.rerolled = true;
  }

  keep() {
    this.kept = true;
  }

  unkeep() {
    this.kept = false;
  }

  getSymbol() {
    return this.type === D6
      ? D6_SYMBOLS[this.#value as keyof typeof D6_SYMBOLS]
      : D12_SYMBOLS[this.#value as keyof typeof D12_SYMBOLS];
  }

  setSymbol() {
    this.#symbols = this.getSymbol();
  }

  isExploding(): boolean {
    return this.#symbols.explosive && this.kept;
  }

  getEmoji(): string {
    if (this.kept) {
      return DISCORD_KEPT_EMOJI[this.type][this.#value];
    }
    return DISCORD_DIE_EMOJI[this.type][this.#value];
  }

  setValue(value: number) {
    this.#value = value;
  }

  getValue() {
    return this.#value;
  }

  getSourceIcon(): string {
    return {
      base: "",
      assistance: "🫱🏽",
      void: "🌀",
      bonus: "⚔️",
      explode: "💢",
    }[this.source];
  }

  toString(): string {
    return `${this.getEmoji()}`;
  }
}

export class Roll {
  #dice: Die[];
  #keepLimit: number;
  #keptDice: number;
  #baseD6: number;
  #baseD12: number;
  #unskilledAssist: number;
  #skilledAssist: number;
  #void?: boolean;

  constructor(
    ring: number,
    skill: number,
    voidpoint: boolean,
    unskillAssist: number,
    skillAssist: number
  ) {
    this.#baseD6 = ring;
    this.#baseD12 = skill || 0;
    this.#unskilledAssist = unskillAssist || 0;
    this.#skilledAssist = skillAssist || 0;
    this.#void = voidpoint;
    this.#dice = [];
    this.#keptDice = 0;
    this.#keepLimit = ring + unskillAssist + skillAssist + (voidpoint ? 1 : 0);
    for (let i = 0; i < this.#baseD6 + this.#unskilledAssist; i++) {
      this.#dice.push(
        new Die(D6, NEWROLL, { source: i < this.#baseD6 ? BASE : ASSISTANCE })
      );
    }
    for (let i = 0; i < this.#baseD12 + this.#skilledAssist; i++) {
      this.#dice.push(
        new Die(D12, NEWROLL, { source: i < this.#baseD12 ? BASE : ASSISTANCE })
      );
    }
    if (this.#void) {
      this.#dice.push(new Die(D6, NEWROLL, { source: VOID }));
    }
  }

  keepDie(index: number) {
    if (this.#keptDice < this.#keepLimit) {
      const die = this.#dice[index];
      die.keep();
      this.#keptDice++;
      if (die.type === D6 && die.getValue() === D6_EXP) {
        this.#dice.push(new Die(die.type, NEWROLL, { source: EXPLODE }));
      }
      if (
        die.type === D12 &&
        (die.getValue() === D12_EXP || die.getValue() === D12_EXP2)
      ) {
        this.#dice.push(new Die(die.type, NEWROLL, { source: EXPLODE }));
      }
      return;
    }
    throw new Error("Can't keep more dice than the ring value.");
  }

  // Currently unused, would have to modify so dice from explosions track which dice preceded them.
  unkeepDie(index: number) {
    const die = this.#dice[index];
    if (
      this.#keptDice > 0 &&
      die.kept &&
      die.source !== BONUS &&
      die.source !== EXPLODE
    ) {
      die.unkeep();
      this.#keptDice--;
      return;
    }
    if (die.source === EXPLODE) {
      // dice from an explosion do not count against the limit of kept die
      die.unkeep();
      return;
    }
    throw new Error(
      "Can't unkeep dice if no dice have been chosen to keep yet, if it's a bonus kept die."
    );
  }

  rerollDie(index: number) {
    this.#dice[index].reroll();
  }

  addKeptDie(type: DieType, value: number) {
    this.#dice.push(new Die(type, value, { source: BONUS })); // Kept will be set to true by default for bonus dice
  }

  getKeptDie() {
    return this.#keptDice;
  }

  getKeptLimit() {
    return this.#keepLimit;
  }

  getAssists() {
    return this.#skilledAssist + this.#unskilledAssist;
  }
  // Roll Result Summing Methods
  // We sum the corresponding value of only kept dice for these methods
  getBonusDice() {
    return this.#dice.reduce(
      (cummulative, current) =>
        cummulative + (current.source === BONUS ? 1 : 0), // die.kept is true for all bonus die by default
      0
    );
  }

  getSuccesses() {
    return this.#dice.reduce(
      (cummulative, current) =>
        cummulative + (current.kept && current.getSymbol().success ? 1 : 0),
      0
    );
  }

  getOpportunities() {
    return this.#dice.reduce(
      (cummulative, current) =>
        cummulative + (current.kept && current.getSymbol().opportunity ? 1 : 0),
      0
    );
  }

  getStrife() {
    return this.#dice.reduce(
      (cummulative, current) =>
        cummulative + (current.kept && current.getSymbol().strife ? 1 : 0),
      0
    );
  }

  getExplosives() {
    return this.#dice.reduce(
      (cummulative, current) =>
        cummulative + (current.kept && current.getSymbol().explosive ? 1 : 0),
      0
    );
  }

  getStringResults() {
    return this.#dice.map((die) => {
      return die.toString();
    });
  }

  getSourceStrings() {
    return this.#dice.map((die) => {
      return die.getSourceIcon();
    })
  }

  // This Method allows certain techniques to turn a dice into a specific result.
  setDie(index: number, value: number) {
    this.#dice[index].setValue(value);
  }
}
