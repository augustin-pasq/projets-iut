const sqlite3 = require('sqlite3').verbose();
// open the database
// sqlite3.OPEN_READWRITE : open the database for reading and writting.
let db = new sqlite3.Database('./sport_track.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the sport-track database.');
});

