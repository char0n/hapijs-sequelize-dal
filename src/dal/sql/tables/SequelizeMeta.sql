DROP TABLE IF EXISTS "SequelizeMeta";

CREATE TABLE "SequelizeMeta"
(
    name character varying(255) NOT NULL,
    CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name)
);