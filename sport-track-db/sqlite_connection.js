const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("../database/sport_track.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) console.error(err.message);
    else console.log("Connected to the SportTrack database.");
});

module.exports = { db };
