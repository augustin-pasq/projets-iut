CREATE TABLE IF NOT EXISTS User(
   lname            TEXT         NOT NULL,
   fname            TEXT         NOT NULL,
   birthdate        TEXT         NOT NULL
   CHECK (birthdate < DATE('now')),
   sex              CHAR(1)      NOT NULL
   CHECK (sex = 'M' OR sex = 'F'),
   height           INT          NOT 
   CHECK (height >= 0 AND height <= 250),
   weight           INT          NOT NULL
   CHECK (weight >= 0 AND weight <= 150),
   email            TEXT         NOT NULL       PRIMARY KEY,
   password         TEXT         NOT NULL
);



CREATE TABLE IF NOT EXISTS Activity(
    id              INT         NOT NULL        PRIMARY KEY,
    date            TEXT        NOT NULL,
    description     TEXT        NOT NULL,
    CONSTRAINT fk_Activite
    FOREIGN KEY (id)
    REFERENCES User(email)
);


CREATE TABLE IF NOT EXISTS DataActivity(
    time                    TEXT         NOT NULL       PRIMARY KEY,
    cardio_frequency        INT          NOT NULL
    CHECK (cardio_frequency >= 0 AND cardio_frequency <= 226),
    latitude                REAL         NOT NULL
    CHECK (latitude >= -90 AND latitude <= 90),   
    longitude               REAL         NOT NULL
    CHECK (longitude >= -180 AND longitude <= 180),
    altitude                INT          NOT NULL
    CHECK (altitude >= 0 AND altitude <= 8848),
    CONSTRAINT fk_DataActivity
    FOREIGN KEY (time)
    REFERENCES Activity(id)
);