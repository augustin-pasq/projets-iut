var db = require('./sqlite_connection').db;

var ActivityDAO = function(){
    this.insert = function(values, callback){
        query = "INSERT INTO  Activity (date, description, distance, activityUser) VALUES (?, ?, ?, ?)";
        db.run(query, values);
    };

    this.update = function(key, values, callback){
        values.push(key)
        query = "UPDATE Activity SET date = ?, description = ?, distance = ?, activityUser = ?";
        db.run(query, values);
    };

    this.delete = function(key, callback){
        values.push(key)
        query = "DELETE FROM Activity WHERE date = ? AND description = ? AND distance = ? AND activityUser = ?";
        db.run(query, key);
    };

    this.findAll = function(callback){
        query = "SELECT * FROM Activity";
        callback(db.all(query, (err, data) => {
            if (err)
                throw err
            console.log(data)
    
        }))
    };

    /**
     * Permet de connaître tous les activités d'un utilisateur en particulier
     */
    this.findAllActivity = function(key, callback){
        values.push(key)
        query = "SELECT * FROM Activity WHERE activityUser = ?";
        callback(db.all(query, (err, data) => {
            if (err)
                throw err
            console.log(data)
    
        }))
    };
};
var dao = new ActivityDAO();
module.exports = dao;