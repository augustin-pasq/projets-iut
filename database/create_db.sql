CREATE TABLE IF NOT EXISTS User(
   lname            TEXT         NOT NULL,
   fname            TEXT         NOT NULL,
   birthdate        TEXT         NOT NULL,
   sex              CHAR(1)      NOT NULL,
   height           INT          NOT NULL,
   weight           INT          NOT NULL,
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
    cardio_frequency        INT          NOT NULL,
    latitude                REAL         NOT NULL,   
    longitude               REAL         NOT NULL,
    altitude                INT          NOT NULL,
    CONSTRAINT fk_DataActivity
    FOREIGN KEY (time)
    REFERENCES Activity(id)
);