var db = require('./sqlite_connection').db;

var UserDAO = function () {
    this.insert = function (values) {
        query = "INSERT INTO User (lname, fname, birthdate, sex, height, weight, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        return new Promise(function (resolve, reject) {
            db.run(query, values,
                function (err) {
                    if (err) reject(err.message)
                    else resolve(true)
                })
        })
    };

    this.update = function (values, key) {
        query = "UPDATE User SET lname = ?, fname = ?, birthdate = ?, sex = ?, height = ?, weight = ? WHERE email= ?";
        values.push(key);
        return new Promise(function (resolve, reject) {
            db.run(query, values,
                function (err) {
                    if (err) reject(err.message)
                    else resolve(true)
                })
        })
    };

    this.delete = function (key) {
        query = "DELETE FROM User WHERE email= ?";
        return new Promise(function (resolve, reject) {
            db.run(query, key,
                function (err) {
                    if (err) reject(err.message)
                    else resolve(true)
                })
        })
    };

    this.findAll = function () {
        query = "SELECT * FROM User";
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
        query = "SELECT * FROM User WHERE email= ?";
        return new Promise(function (resolve, reject) {
            db.get(query, key, function (err, row) {
                if (err) reject("Read error: " + err.message)
                else {
                    resolve(row)
                }
            })
        })
    };
};

var dao = new UserDAO();
module.exports = dao;