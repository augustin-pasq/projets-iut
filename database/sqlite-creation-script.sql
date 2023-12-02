DROP TABLE IF EXISTS Card;
DROP TABLE IF EXISTS Player;
DROP TABLE IF EXISTS Round;
DROP TABLE IF EXISTS Game;

CREATE TABLE Game
(
    id            TEXT PRIMARY KEY,
    creation_date DATETIME NOT NULL DEFAULT (datetime('now')),
    accessCode    TEXT     NOT NULL,
    roundsToReach INTEGER,
    isOpen        BOOLEAN
);

CREATE TABLE Player
(
    id            TEXT PRIMARY KEY,
    creation_date DATETIME NOT NULL DEFAULT (datetime('now')),
    username      TEXT     NOT NULL,
    roundsWon     INTEGER,
    game          TEXT,
    winner        BOOLEAN,

    FOREIGN KEY (game) REFERENCES Game (id)
);

CREATE TABLE Round
(
    id            TEXT PRIMARY KEY,
    creation_date DATETIME NOT NULL DEFAULT (datetime('now')),
    game          TEXT     NOT NULL,

    FOREIGN KEY (game) REFERENCES Game (id)
);

CREATE TABLE Card
(
    id            TEXT PRIMARY KEY,
    creation_date DATETIME NOT NULL DEFAULT (datetime('now')),
    positionX     INTEGER,
    positionY     INTEGER,
    color         TEXT     NOT NULL,
    value         INTEGER  NOT NULL,
    round         TEXT     NOT NULL,
    player        TEXT     NOT NULL,

    FOREIGN KEY (round) REFERENCES Round (id),
    FOREIGN KEY (player) REFERENCES Player (id)
);