import { Roll } from "../helpers/diceUtils";
type rollDataStore = {
  [key: string]: Roll;
};
const rollData: rollDataStore = {};

export default rollData;
