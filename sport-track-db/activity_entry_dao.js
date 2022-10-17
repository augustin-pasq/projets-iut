var db = require('./sqlite_connection').db;

var ActivityEntryDAO = function(){
    this.insert = function(values, callback){
        query = "INSERT INTO DataActivity (time, cardio_frequency,  latitude , longitude, altitude, idActivity) VALUES (?, ?, ?, ?, ?, ?)";
        db.run(query, values);
    };

    this.update = function(key, values, callback){
        values.push(key)
        query = "UPDATE DataActivity SET time = ?, cardio_frequency = ?, latitude = ?, longitude = ?, altitude = ?, idActivity = ?";
        db.run(query, values);
    };

    this.delete = function(key, callback){
        values.push(key)
        query = "DELETE FROM DataActivity WHERE idActivity= ?";
        db.run(query, key);
    };

    this.findAll = function(callback){
        query = "SELECT * FROM DataActivity";
        callback(db.all(query, (err, data) => {
            if (err)
                throw err
            console.log(data)
    
        }))
    };

    
    /**
     * Permet de connaître tous les données d'une activité en particulier
     */
    this.findAllData = function(key, callback){
        values.push(key)
        query = "SELECT rowid FROM Activity WHERE date = ? AND description = ? AND activityUser = ?";
        // TO DO
    }
};

var dao = new ActivityEntryDAO();
module.exports = dao;