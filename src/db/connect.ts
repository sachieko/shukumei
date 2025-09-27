import { Pool } from "pg";

type dbParamtypes = (string | number | boolean | undefined)[];

const pool = new Pool({
  connectionString: process.env.DBURL,
});

export const db = {
  query: async (text: string, params?: dbParamtypes) => {
    const client = await pool.connect();
    try {
      return await client.query(text, params);
    } finally {
      client.release();
    }
  },
};
