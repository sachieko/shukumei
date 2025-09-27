require("dotenv").config();

import fs from "fs";
import { db } from "./connect";

//Load schema
const runSchemaFiles = async () => {
  console.log(`Beginning purge and reset of Shukumei PSQL tables...`);
  const schemaFileNames = fs.readdirSync("./db/schema");

  for (const filename of schemaFileNames) {
    const sql = fs.readFileSync(`./db/schema/${filename}`, "utf8");
    console.log(`\t-> Creating ${filename}`);
    await db.query(sql);
  }
};

const resetDatabase = async () => {
  try {
    console.log("-> Connecting to Postgres DB...");
    await runSchemaFiles;
    console.log("Postgres DB reset and cleared.");
    process.exit();
  } catch (error) {
    console.error(`Reset Failed due to error:`, error);
    console.error(JSON.stringify(error));
    process.exit();
  }
};

resetDatabase();
