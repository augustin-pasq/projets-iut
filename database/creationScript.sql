CREATE TABLE Game
(
    id            INTEGER PRIMARY KEY AUTO_INCREMENT,
    accessCode    VARCHAR(255) NOT NULL,
    roundsToReach INTEGER
);

CREATE TABLE Player
(
    id        INTEGER PRIMARY KEY AUTO_INCREMENT,
    username  VARCHAR(32) NOT NULL,
    roundsWon INTEGER,
    game      INTEGER,

    FOREIGN KEY (game) REFERENCES Game (id)
);

CREATE TABLE Card
(
    id        INTEGER PRIMARY KEY AUTO_INCREMENT,
    positionX INTEGER,
    positionY INTEGER,
    color     VARCHAR(7) NOT NULL,
    value     INTEGER,
    game      INTEGER    NOT NULL,
    player    INTEGER    NOT NULL,

    CONSTRAINT ck_color CHECK (color IN ('#ED1D23', '#00B9F1', '#F9AE19', '#70BE44')),
    CONSTRAINT ck_value CHECK (value BETWEEN 1 AND 9),
    FOREIGN KEY (game) REFERENCES Game (id),
    FOREIGN KEY (player) REFERENCES Player (id)
);

CREATE TABLE Series
(
    id    INTEGER PRIMARY KEY AUTO_INCREMENT,
    score INTEGER
);

CREATE TABLE CardSeries
(
    card   INTEGER NOT NULL,
    series INTEGER NOT NULL,

    PRIMARY KEY (card, series),
    FOREIGN KEY (card) REFERENCES Card (id),
    FOREIGN KEY (series) REFERENCES Series (id)
);