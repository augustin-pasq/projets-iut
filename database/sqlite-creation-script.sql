DROP TABLE Series;
DROP TABLE Card;
DROP TABLE Player;
DROP TABLE Round;
DROP TABLE Game;

CREATE TABLE Game
(
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    accessCode    TEXT NOT NULL,
    roundsToReach INTEGER,
    isOpen        BOOLEAN
);

CREATE TABLE Player
(
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    username  TEXT NOT NULL,
    roundsWon INTEGER,
    game      INTEGER,
    winner    BOOLEAN,

    FOREIGN KEY (game) REFERENCES Game (id)
);

CREATE TABLE Round
(
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    game INTEGER NOT NULL,

    FOREIGN KEY (game) REFERENCES Game (id)
);

CREATE TABLE Card
(
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    positionX INTEGER,
    positionY INTEGER,
    color     TEXT    NOT NULL,
    value     INTEGER NOT NULL,
    round     INTEGER NOT NULL,
    player    INTEGER NOT NULL,

    FOREIGN KEY (round) REFERENCES Round (id),
    FOREIGN KEY (player) REFERENCES Player (id)
);

CREATE TABLE Series
(
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    seriesColor TEXT    NOT NULL,
    score       INTEGER,
    length      INTEGER,
    start       INTEGER NOT NULL,
    end         INTEGER NOT NULL,
    round       INTEGER NOT NULL,

    FOREIGN KEY (start) REFERENCES Card (id),
    FOREIGN KEY (end) REFERENCES Card (id),
    FOREIGN KEY (round) REFERENCES Round (id)
);