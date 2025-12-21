import { Roll } from "../helpers/diceUtils";
type rollDataStore = {
  [key: string]: Roll;
};
const rollData: rollDataStore = {};
const ONE_DAY = 1000 * 60 * 60 * 24;

const removeOldRolls = () => {
  const today = new Date();
  for (let roll in rollData) {
    if (rollData[roll].getExpiry() <= today) {
      delete rollData[roll];
    }
  }
};

export const cleanUpInterval = setInterval(() => {
  removeOldRolls();
}, ONE_DAY);

export default rollData;

