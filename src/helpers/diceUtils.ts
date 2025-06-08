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
  STATE,
  State,
  SOURCE_EMOJI,
} from "../types/diceConstants";

export class Die {
  readonly type: DieType;
  #source: DieSource;
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
    this.rerolled = rerolled;
    this.#source = source;
    this.kept = source === BONUS ? true: kept;
    this.#value = value === 0 ? this.#rollDie() : value;
    this.#symbols = this.getSymbol();
  }

  #rollDie() {
    const timeEntropy = (Date.now() % 1000) / 1000;
    const entropicRoll = (Math.random() + timeEntropy) % 1;
    this.#value =
      this.type === D6
        ? Math.floor(entropicRoll * 6) + 1
        : Math.floor(entropicRoll * 12) + 1;
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

  setSource(value: DieSource) {
    this.#source = value;
  }

  getSource() {
    return this.#source;
  }

  getValue() {
    return this.#value;
  }

  getSourceIcon(): string {
    return SOURCE_EMOJI[this.#source];
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
  #state: State;

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
    this.#state = STATE.AWAIT;
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
    const dieToKeep = this.#dice[index];
    const dieSource = dieToKeep.getSource()
    if (this.#keptDice < this.#keepLimit || dieSource === EXPLODE) {
      const die = this.#dice[index];
      die.keep();
      if (dieSource !== EXPLODE) this.#keptDice++;
      if (die.type === D6 && die.isExploding()) {
        this.#dice.push(new Die(die.type, NEWROLL, { source: EXPLODE }));
      }
      if (die.type === D12 && die.isExploding()) {
        this.#dice.push(new Die(die.type, NEWROLL, { source: EXPLODE }));
      }
      return true;
    }
    return false;
  }

  // Currently unused, would have to modify so dice from explosions track which dice preceded them.
  unkeepDie(index: number) {
    const die = this.#dice[index];
    const dieSource = die.getSource();
    if (
      this.#keptDice > 0 &&
      die.kept &&
      dieSource !== BONUS &&
      dieSource !== EXPLODE
    ) {
      die.unkeep();
      this.#keptDice--;
      return;
    }
    if (dieSource === EXPLODE) {
      // diSourcedieSourcean explosion do not count against the limit of #kept die
      die.unkeep();
      return;
    }
    throw new Error(
      "Can't unkeep dice if no dice have been chosen to keep yet, if it's a bonus #kept die."
    );
  }

  rerollDie(index: number) {
    this.#dice[index].reroll();
  }

  getDieType(index: number) {
    return this.#dice[index].type;
  }

  getDiceLength() {
    return this.#dice.length;
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
  // Roll Result Summing Methods

  getAssists() {
    return this.#skilledAssist + this.#unskilledAssist;
  }
  // We sum the corresponding value of only #kept dice for these methods

  getBonusDice() {
    return this.#dice.reduce(
      (cummulative, current) =>
        cummulative + (current.getSource() === BONUS ? 1 : 0), // die.#kept is true for all bonus die by default
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
    const strings = this.#dice.map((die) => {
      return die.getSourceIcon();
    });
    // Unfortunately when dice get rerolled or modded, it sometimes hides these modifiers
    // So we have to check if they are there to add them
    if (this.#void && !strings.includes(SOURCE_EMOJI.void)) {
      strings.push(SOURCE_EMOJI.void);
    }
    const assistStrings = strings.filter(string => string === SOURCE_EMOJI.assistance)
    if (this.#skilledAssist + this.#unskilledAssist > assistStrings.length) {
      for (let i = 0; i < this.#skilledAssist + this.#unskilledAssist - assistStrings.length; i++) {
        strings.push(SOURCE_EMOJI.assistance);
      }
    }
    return strings;
  }

  getRerolls() {
    return this.#dice.reduce(
      (cummulative, current) =>
        cummulative + (current.kept && current.rerolled ? 1 : 0),
      0
    );
  }

  getKeptStrings() {
    const keptDie = this.#dice.filter((die) => {
      return die.kept;
    });
    return keptDie.map((die => die.toString()))
  }

  // This Method allows certain techniques to turn a dice into a specific result.
  setDie(index: number, value: number, source?: DieSource) {
    this.#dice[index].setValue(value);
    if (source) {
      this.#dice[index].setSource(source)
    }
    return this.#dice[index]
  }

  getState() {
    return this.#state;
  }

  setState(state: State) {
    this.#state = state;
  }

  getStateString() {
    // Chose the if (state comparison) pattern in case more complex state exists for features later
    if (this.#state === STATE.AWAIT) return "Deciding...";
    if (this.#state === STATE.KEPT) return "Kept dice...";
    if (this.#state === STATE.REROLLED) return "Rerolled dice...";
    if (this.#state === STATE.ADDED) return "Added kept dice...";
    if (this.#state === STATE.FINAL) return "Finalized";
    if (this.#state === STATE.MODDED) return "Modified dice..."
  }
}
