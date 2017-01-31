DROP TABLE IF EXISTS "user";

CREATE TABLE "user"
 (
  id uuid PRIMARY KEY NOT NULL,
  username VARCHAR,
  first_name VARCHAR,
  last_name VARCHAR
);
