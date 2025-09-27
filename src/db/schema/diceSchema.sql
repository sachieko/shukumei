DROP TABLE IF EXISTS shukumei_dice CASCADE;

CREATE TABLE shukumei_dice (
  roll_uid VARCHAR(50) NOT NULL,
  die_index INTEGER NOT NULL,
  type VARCHAR(4) NOT NULL,
  source VARCHAR(11) NOT NULL,
  explosive_index INTEGER,
  kept BOOLEAN NOT NULL,
  rerolled BOOLEAN NOT NULL,
  value INTEGER NOT NULL,
  PRIMARY KEY (roll_uid, die_index),
  FOREIGN KEY (roll_uid) REFERENCES shukumei_rolls(roll_uid) ON DELETE CASCADE
);