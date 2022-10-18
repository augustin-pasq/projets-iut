var db = require('./sqlite_connection').db;

var UserDAO = function(){
    this.insert = function(values, callback){
        query = "INSERT INTO User (lname, fname, birthdate, sex, height, weight, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        db.run(query, values);
    };

    this.update = function(key, values, callback){
        values.push(key)
        query = "UPDATE User SET lname = (?), fname = (?), birthdate = (?), sex = (?), height = (?), weight = (?) WHERE email= (?)";
        db.run(query, values);
    };

    this.delete = function(key, callback){
        query = "DELETE FROM User WHERE email= (?)";
        db.run(query, key);
    };

    this.findAll = function(callback){
        query = "SELECT * FROM User";
        callback(db.all(query, (err, data) => {
            if (err)
                throw err
            console.log(data)
        }))
    };

    this.findByKey = function(key, callback){
        query = "SELECT * FROM User WHERE email= (?)";
        callback(db.all(query, (err, data) => {
            if (err)
                throw err
            console.log(data)
    
        }))
    };
};
var dao = new UserDAO();
module.exports = dao;