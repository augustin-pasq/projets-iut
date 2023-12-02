DROP TABLE IF EXISTS Card;
DROP TABLE IF EXISTS Player;
DROP TABLE IF EXISTS Round;
DROP TABLE IF EXISTS Game;

CREATE TABLE Game
(
    id            VARCHAR(255) PRIMARY KEY,
    creation_date DATETIME     NOT NULL DEFAULT (NOW()),
    accessCode    VARCHAR(255) NOT NULL,
    roundsToReach INTEGER,
    isOpen        BOOLEAN
);

CREATE TABLE Player
(
    id            VARCHAR(255) PRIMARY KEY,
    creation_date DATETIME    NOT NULL DEFAULT (NOW()),
    username      VARCHAR(32) NOT NULL,
    roundsWon     INTEGER,
    game          VARCHAR(255),
    winner        BOOLEAN,

    FOREIGN KEY (game) REFERENCES Game (id)
);

CREATE TABLE Round
(
    id            VARCHAR(255) PRIMARY KEY,
    creation_date DATETIME     NOT NULL DEFAULT (NOW()),
    game          VARCHAR(255) NOT NULL,

    FOREIGN KEY (game) REFERENCES Game (id)
);

CREATE TABLE Card
(
    id            VARCHAR(255) PRIMARY KEY,
    creation_date DATETIME     NOT NULL DEFAULT (NOW()),
    positionX     INTEGER,
    positionY     INTEGER,
    color         VARCHAR(7)   NOT NULL,
    value         INTEGER      NOT NULL,
    round         VARCHAR(255) NOT NULL,
    player        VARCHAR(255) NOT NULL,

    FOREIGN KEY (round) REFERENCES Round (id),
    FOREIGN KEY (player) REFERENCES Player (id)
);