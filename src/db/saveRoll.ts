import { db } from "./connect";
import { Die, Roll } from "../helpers/diceUtils";

const saveRoll = async (rollId: string, roll: Roll) => {
  const params = [
    rollId,
    roll.getKeptLimit(),
    roll.getRingDice(),
    roll.getSkillDice(),
    roll.getUnskilledAssists(),
    roll.getSkilledAssists(),
    roll.getState(),
    roll.getVoid(),
    roll.getLabel(),
    roll.getUnkept(),
    roll.getTN(),
  ];
  const sqlRoll = `
  INSERT INTO shukumei_rolls 
  (
    roll_uid,
    keep_limit, 
    base_d6, 
    base_d12, 
    unskilled_assist,
    skilled_assist, 
    state, 
    void, 
    label, 
    unkept, 
    tn
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);`;
  await db.query(sqlRoll, params);
  const sqlDice = `
  INSERT INTO shukumei_dice
  ( 
    roll_uid,
    die_index,
    type,
    source,
    explosive_index,
    kept,
    rerolled,
    value
  ) 
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`;
  const dice = roll.getDice();
  dice.forEach(async (die: Die, index: number) => {
    const dieParams = [
      rollId,
      index,
      die.type,
      die.getSource(),
      die.getExplosiveIndex(),
      die.kept,
      die.rerolled,
      die.getValue(),
    ];
    await db.query(sqlDice, dieParams);
  });
};

export default saveRoll;
