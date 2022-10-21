var db = require('./sqlite_connection').db;

var ActivityEntryDAO = function () {
    this.insert = function (values) {
        query = "INSERT INTO DataActivity (time, cardio_frequency,  latitude , longitude, altitude, idActivity) VALUES (?, ?, ?, ?, ?, ?)";
        return new Promise(function (resolve, reject) {
            db.run(query, values,
                function (err) {
                    if (err) reject(err.message)
                    else resolve(true)
                })
        })
    };

    this.update = function (values, key) {
        query = "UPDATE DataActivity SET time = ?, cardio_frequency = ?, latitude = ?, longitude = ?, altitude = ?, idActivity = ?";
        values.push(key);
        return new Promise(function (resolve, reject) {
            db.run(query, values,
                function (err) {
                    if (err) reject(err.message)
                    else resolve(true)
                })
        })
    };

    this.delete = function (values, key) {
        query = "DELETE FROM DataActivity WHERE time = ? AND cardio_frequency = ? AND latitude = ? AND longitude = ? AND altitude = ? AND idActivity = ?";
        values.push(key);
        return new Promise(function (resolve, reject) {
            db.run(query, values,
                function (err) {
                    if (err) reject(err.message)
                    else resolve(true)
                })
        })
    };

    this.findAll = function () {
        query = "SELECT * FROM DataActivity";
        return new Promise(function (resolve, reject) {
            db.all(query, function (err, rows) {
                if (err) reject("Read error: " + err.message)
                else {
                    resolve(rows)
                }
            })
        })
    };

    this.findByKey = function (key) {
        query = "SELECT * FROM Activity WHERE activityUser = ?";
        return new Promise(function (resolve, reject) {
            db.get(query, key, function (err, row) {
                if (err) reject("Read error: " + err.message)
                else {
                    resolve(row)
                }
            })
        })
    };

    this.findDataByActivity = function (key) {
        query = "SELECT rowid FROM Activity WHERE date = ? AND description = ? AND activityUser = ?";
        return new Promise(function (resolve, reject) {
            db.all(query, key, function (err, row) {
                if (err) reject("Read error: " + err.message)
                else {
                    resolve(row)
                }
            })
        })
    };
};

var dao = new ActivityEntryDAO();
module.exports = dao;