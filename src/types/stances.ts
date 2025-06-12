export type Stance = {
  label: string;
  value: string;
  description: string;
};

export type Stances = {
  air: Stance;
  earth: Stance;
  water: Stance;
  fire: Stance;
  void: Stance;
};

export const stances: Stances = {
  earth: {
    label: "Earth stance",
    value: "earth",
    description: "A sturdy and grounded stance.",
  },
  air: {
    label: "Air stance",
    value: "air",
    description: "A graceful and deceptive stance.",
  },
  water: {
    label: "Water stance",
    value: "water",
    description: "A flowing and adaptive stance.",
  },
  fire: {
    label: "Fire stance",
    value: "fire",
    description: "An aggressive and powerful stance.",
  },
  void: {
    label: "Void stance",
    value: "void",
    description: "A formless and sacrificial stance.",
  },
};
