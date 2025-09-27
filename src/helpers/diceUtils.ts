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
  SHAME_EMOJI,
  DICE_TRACKER_EMOJI,
} from "../types/diceConstants";

export class Die {
  readonly type: DieType;
  #source: DieSource;
  #explosiveIndex: number | undefined;
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
      explosiveIndex = undefined,
    }: {
      kept?: boolean;
      rerolled?: boolean;
      source?: DieSource;
      explosiveIndex?: number | undefined;
    } = {}
  ) {
    this.type = type;
    this.rerolled = rerolled;
    this.#source = source;
    this.kept = kept;
    this.#value = value === 0 ? this.#rollDie() : value;
    this.#symbols = this.getSymbol();
    this.#explosiveIndex = explosiveIndex;
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

  getExplosiveIndex() {
    return this.#explosiveIndex;
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
  #baseD6: number;
  #baseD12: number;
  #unskilledAssist: number;
  #skilledAssist: number;
  #state: State;
  #void: boolean;
  #label: string;
  #unkept: number;
  #TN?: number | "?";

  constructor(
    ring: number,
    skill: number,
    unskillAssist: number = 0,
    skillAssist: number = 0,
    voidpoint: boolean = false,
    TN: number | "?" = "?",
    label: string = "Roll Results",
    unkept: number = 0
  ) {
    this.#baseD6 = ring;
    this.#baseD12 = skill ?? 0;
    this.#unskilledAssist = unskillAssist ?? 0;
    this.#skilledAssist = skillAssist ?? 0;
    this.#void = voidpoint;
    this.#dice = [];
    this.#state = STATE.AWAIT;
    this.#keepLimit = ring + unskillAssist + skillAssist + (voidpoint ? 1 : 0);
    this.#TN = TN;
    this.#label = label;
    this.#unkept = unkept;
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
  // Dice resulting from explosives always have the option to keep them in addition to normal dice.
  keepDie(index: number) {
    const dieToKeep = this.#dice[index];
    if (dieToKeep.kept === true) {
      // If the dice is already kept, unkeep it and exit
      this.unkeepDie(index);
      return false;
    }
    const keptDice = this.getKeptDice();
    const dieSource = dieToKeep.getSource();
    if (keptDice < this.#keepLimit || dieSource === EXPLODE) {
      dieToKeep.keep();
      if (!dieToKeep.isExploding()) return true;
      if (dieToKeep.isExploding()) {
        if (dieToKeep.type === D6) {
          this.#dice.push(
            new Die(dieToKeep.type, NEWROLL, {
              source: EXPLODE,
              explosiveIndex: index,
            })
          );
        }
        if (dieToKeep.type === D12) {
          this.#dice.push(
            new Die(dieToKeep.type, NEWROLL, {
              source: EXPLODE,
              explosiveIndex: index,
            })
          );
        }
      }
    }
    return false;
  }

  getTN() {
    return this.#TN;
  }

  getLabel() {
    return this.#label;
  }

  removeResultingDie(index: number) {
    this.#dice.map((die, index2) => {
      // If a die is the result of exploding from the given index
      if (die.getExplosiveIndex() === index) {
        if (die.isExploding() && die.kept) {
          // If it is also explosive and kept, call the function again with the new index.
          this.removeResultingDie(index2);
        }
        // Remove the die from the dice array
        this.#dice.splice(index2, 1);
      }
    });
  }

  unkeepDie(index: number) {
    const die = this.#dice[index];
    if (!die.kept) {
      return;
    }
    // If explosive and kept, remove any dice resulting from it.
    if (die.isExploding() && die.kept) {
      this.removeResultingDie(index);
    }
    die.unkeep();
    this.#unkept++;
    return;
  }

  rerollDie(index: number) {
    this.#dice[index].reroll();
  }

  getDieType(index: number) {
    return this.#dice[index].type;
  }

  getKeptDice() {
    return this.#dice.reduce(
      (cummulative, current) =>
        // Exploding/bonus kept die do not count against the number of kept dice
        cummulative +
        (current.kept === true &&
        current.getSource() !== EXPLODE &&
        current.getSource() !== BONUS
          ? 1
          : 0), // Exploding die do not count against the number of kept dice
      0
    );
  }

  getRingDice() {
    return this.#baseD6;
  }

  getSkillDice() {
    return this.#baseD12;
  }

  getDiceLength() {
    return this.#dice.length;
  }
  addKeptDie(type: DieType, value: number, kept: boolean) {
    this.#dice.push(new Die(type, value, { source: BONUS, kept: kept }));
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
    const stringResults = this.#dice
      .map((die) => {
        return die.toString();
      })
      .join("");
      let indexEmoji = "";
      // Start counting at one like our users
      for (let i = 1; i < this.#dice.length + 1; i++) {
        indexEmoji += DICE_TRACKER_EMOJI[`${i % 10}`]
      }
      return `${stringResults}
      ${indexEmoji}`;
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
    const assistStrings = strings.filter(
      (string) => string === SOURCE_EMOJI.assistance
    );
    if (this.#skilledAssist + this.#unskilledAssist > assistStrings.length) {
      for (
        let i = 0;
        i < this.#skilledAssist + this.#unskilledAssist - assistStrings.length;
        i++
      ) {
        strings.push(SOURCE_EMOJI.assistance);
      }
    }
    for (let i = 0; i < this.#unkept; i++) {
      strings.push(SHAME_EMOJI);
    }
    return strings;
  }

  getUnkept() {
    return this.#unkept;
  }

  getRerolls() {
    return this.#dice.reduce(
      (cummulative, current) => cummulative + (current.rerolled ? 1 : 0),
      0
    );
  }

  getKeptStrings() {
    const keptDie = this.#dice.filter((die) => {
      return die.kept;
    });
    return keptDie.map((die) => die.toString());
  }
  getUnkeptStrings() {
    const unKeptDie = this.#dice.filter((die) => {
      return !die.kept;
    });
    return unKeptDie.map((die) => die.toString());
  }

  getFinalStrings() {
    const finalString = [...this.getKeptStrings(), ...this.getUnkeptStrings()];
    return finalString.join("");
  }

  // This Method allows certain techniques to turn a dice into a specific result.
  setDie(index: number, value: number, source?: DieSource) {
    const dieToSet = this.#dice[index];
    dieToSet.setValue(value);
    dieToSet.setSymbol();
    if (source) {
      this.#dice[index].setSource(source);
    }
    return this.#dice[index];
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
    if (this.#state === STATE.MODDED) return "Modified dice...";
  }
}
