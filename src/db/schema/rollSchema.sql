DROP TABLE IF EXISTS shukumei_rolls CASCADE;

CREATE TABLE shukumei_rolls (
  roll_uid VARCHAR(60) PRIMARY KEY, -- discordId-generateduid
  created_at TIMESTAMPTZ DEFAULT NOW(),
  keep_limit INTEGER NOT NULL,
  base_d6 INTEGER NOT NULL,
  base_d12 INTEGER NOT NULL,
  unskilled_assist INTEGER NOT NULL,
  skilled_assist INTEGER NOT NULL,
  state INTEGER NOT NULL,
  void BOOLEAN NOT NULL,
  label VARCHAR(255),
  unkept INTEGER NOT NULL,
  tn INTEGER
);