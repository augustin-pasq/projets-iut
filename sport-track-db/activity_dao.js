var db = require('./sqlite_connection').db;

var UserDAO = function () {
    this.insert = function (values) {
        query = "INSERT INTO  Activity (date, description, distance, activityUser) VALUES (?, ?, ?, ?)";
        return new Promise(function (resolve, reject) {
            db.run(query, values,
                function (err) {
                    if (err) reject(err.message)
                    else resolve(true)
                })
        })
    };

    this.update = function (values, key) {
        query = "UPDATE Activity SET date = ?, description = ?, distance = ?, activityUser = ?";
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
        query = "DELETE FROM Activity WHERE date = ? AND description = ? AND distance = ? AND activityUser = ?";
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
        query = "SELECT * FROM Activity";
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

    this.findActivitiesByUser = function (key) {
        query = "SELECT * FROM Activity WHERE activityUser = ?";
        return new Promise(function (resolve, reject) {
            db.all(query, key, function (err, rows) {
                if (err) reject("Read error: " + err.message)
                else {
                    resolve(rows)
                }
            })
        })
    };
};

var dao = new UserDAO();
module.exports = dao;