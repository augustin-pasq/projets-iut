DROP TABLE Series;
DROP TABLE Card;
DROP TABLE Player;
DROP TABLE Round;
DROP TABLE Game;

CREATE TABLE Game
(
    id            INTEGER PRIMARY KEY AUTO_INCREMENT,
    accessCode    VARCHAR(255) NOT NULL,
    roundsToReach INTEGER,
    isOpen        BOOLEAN
);

CREATE TABLE Player
(
    id        INTEGER PRIMARY KEY AUTO_INCREMENT,
    username  VARCHAR(32) NOT NULL,
    roundsWon INTEGER,
    game      INTEGER,
    winner    BOOLEAN,

    FOREIGN KEY (game) REFERENCES Game (id)
);

CREATE TABLE Round
(
    id   INTEGER PRIMARY KEY AUTO_INCREMENT,
    game INTEGER NOT NULL,

    FOREIGN KEY (game) REFERENCES Game (id)
);

CREATE TABLE Card
(
    id        INTEGER PRIMARY KEY AUTO_INCREMENT,
    positionX INTEGER,
    positionY INTEGER,
    color     VARCHAR(7) NOT NULL,
    value     INTEGER    NOT NULL,
    round     INTEGER    NOT NULL,
    player    INTEGER    NOT NULL,

    FOREIGN KEY (round) REFERENCES Round (id),
    FOREIGN KEY (player) REFERENCES Player (id)
);

CREATE TABLE Series
(
    id          INTEGER PRIMARY KEY AUTO_INCREMENT,
    seriesColor VARCHAR(7) NOT NULL,
    score       INTEGER,
    length      INTEGER,
    start       INTEGER    NOT NULL,
    end         INTEGER    NOT NULL,
    round       INTEGER    NOT NULL,

    FOREIGN KEY (start) REFERENCES Card (id),
    FOREIGN KEY (end) REFERENCES Card (id),
    FOREIGN KEY (round) REFERENCES Round (id)
);