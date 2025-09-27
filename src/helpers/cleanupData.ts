import { db } from "../db/connect";

const cleanupData = async () => {
  try {
    const query = `
    DELETE FROM shukumei_rolls 
    WHERE created_at < NOW() - INTERVAL '14 days'
    RETURNING *;`;
    const result = await db.query(query);
    console.log(`Cleaned ${result.rowCount} old records from Shukumei's rolls`);
  } catch (error) {
    console.error("Cleaning failed:", error);
  }
};

export default cleanupData;
