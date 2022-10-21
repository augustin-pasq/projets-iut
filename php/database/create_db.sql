CREATE TABLE IF NOT EXISTS User(
   lname            TEXT         NOT NULL,
   fname            TEXT         NOT NULL,
   birthdate        TEXT         NOT NULL,
   sex              CHAR(1)      NOT NULL
   CHECK (sex = 'M' OR sex = 'F'),
   height           INTEGER      NOT NULL
   CHECK (height >= 0 AND height <= 250),
   weight           INTEGER      NOT NULL
   CHECK (weight >= 0 AND weight <= 150),
   email            TEXT         NOT NULL       PRIMARY KEY,
   password         TEXT         NOT NULL
);

CREATE TABLE IF NOT EXISTS Activity(
    rowid           INTEGER     NOT NULL    PRIMARY KEY,
    date            TEXT        NOT NULL,
    description     TEXT        NOT NULL,
    distance        REAL        NOT NULL,
    activityUser    TEXT        NOT NULL,
    CONSTRAINT fk_Activite
    FOREIGN KEY (activityUser)
    REFERENCES User(email)
);

CREATE TABLE IF NOT EXISTS DataActivity(
    rowid                   INTEGER      NOT NULL   PRIMARY KEY,
    time                    TEXT         NOT NULL,
    cardio_frequency        INTEGER      NOT NULL
    CHECK (cardio_frequency >= 0 AND cardio_frequency <= 226),
    latitude                REAL         NOT NULL,   
    longitude               REAL         NOT NULL,
    altitude                INTEGER      NOT NULL,
    idActivity              INTEGER      NOT NULL,
    CONSTRAINT fk_DataActivity
    FOREIGN KEY (idActivity)
    REFERENCES Activity(rowid)
);