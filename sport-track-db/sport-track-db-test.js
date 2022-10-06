var user_dao = require('./sport-track-db').user_dao;
var db = require('./sqlite_connection').db;

function funcVideTable(callback) {
    db.run('DELETE FROM User')
}

function test () {


    // Affichage des nom des tables de la base de données pour vérifier la bonne connexion à la base
    console.log("[+] Test de la connexion :\t");
    db.all("SELECT name FROM sqlite_master WHERE type='table';", (err, data) => {
        if (err)
            throw err
        console.log(data)
    })
    console.log("\n\n");

    // Insertion de données puis on les affiche pour vérifier la bonne insertion
    console.log("[+] Test de l'insertion :\t");
    var utilisateur = ["John", "Doe", "12/01/1983", "M", 190, 95, "johndoe@test.com", "pass"];
    user_dao.insert(utilisateur);

    user_dao.findAll(console.log)

    // Modification de données puis on les affiche pour vérifier la bonne modification
    console.log("[+] Test de la modification :\t");
    var utilisateurModif = ["John", "Doe", "12/01/1983", "M", 190, 90];
    var key = "johndoe@test.com"
    user_dao.update(key, utilisateurModif);

    user_dao.findAll(console.log)
    
    // Suppression de données puis on affiche la table pour vérifier la bonne suppression
    console.log("[+] Test de la suppression :\t");
    var key = ["johndoe@test.com"]
    user_dao.delete(key);

    user_dao.findAll(console.log)


}


funcVideTable(test())

