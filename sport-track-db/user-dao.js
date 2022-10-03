var db = require('./sqlite_connection');
var UserDAO = function(){
    this.insert = function(values, callback){
    

        var db = require('./sport-track-db').db_connection;
        query = "INSERT INTO User (lname, fname, birthdate, sex, height, weight, email, password) VALUES ('$l', '$f', '$b', '$s', $h, $w, '$e', '$p')";
        stmt = db.prepare(query);
        stmt.execute();


    };

    this.update = function(key, values, callback){

    };
    this.delete = function(key, callback){

    };
    this.findAll = function(callback){

    };
    this.findByKey = function(key, callback){
        
    };
};
var dao = new UserDAO();
module.exports = dao;