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
/*  id              INTEGER     NOT NULL        PRIMARY KEY     AUTOINCREMENT,

SQLite recommande de ne pas utiliser l'attribut AUTOINCREMENT car :
- Le mot-clé AUTOINCREMENT impose une surcharge de CPU, de mémoire, d'espace disque et d'E/S disque et doit être évité s'il n'est pas strictement nécessaire. 
- De plus, la manière dont SQLite attribue une valeur à la colonne AUTOINCREMENT est légèrement différente de celle utilisée pour la colonne rowid.

Lorsque vous créez une table sans spécifier l'option WITHOUT ROWID, vous obtenez une colonne auto-incrémentée implicite appelée rowid.
La colonne rowid stocke un entier signé de 64 bits qui identifie de manière unique une ligne de la table.

On utilisera la colonne rowid comme clé primaire et comme clé étrangère de DataActivity
*/
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
    rowid           INTEGER     NOT NULL    PRIMARY KEY,
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