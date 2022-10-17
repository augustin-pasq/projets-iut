var user_dao = require('./sport-track-db').user_dao;
var db = require('./sqlite_connection').db;


// Permet de vider la table User pour pouvoir réexecuter deux fois les tests sans avoir de problèle de clé primaire
function begintest() {
    db.run('DELETE FROM User;')
    affichageTable();
}   


// Affichage des nom des tables de la base de données pour vérifier la bonne connexion à la base
function affichageTable() {
    console.log("[+] Test de la connexion :\t");
    db.all("SELECT name FROM sqlite_master WHERE type='table';", (err, data) => {
        if (err)
            throw err
        console.log(data)
        testInsert();
    })
}

// Insertion de données puis on les affiche pour vérifier la bonne insertion
function testInsert() {
    var utilisateur = ["John", "Doe", "12/01/1983", "M", 190, 95, "johndoe@test.com", "pass"];
    console.log("[+] Test de l'insertion :\t");
    user_dao.insert(utilisateur, () => {
        console.log("Passage critique")
        user_dao.findAll((err, res) => {
            console.log(err, res);
            testUpdate();
        })
    });
}



// Modification de données puis on les affiche pour vérifier la bonne modification
function testUpdate() {
    var utilisateurModif = ["John", "Doe", "12/01/1983", "M", 190, 90];
    console.log("[+] Test de la modification :\t");
    var key = "johndoe@test.com"
    user_dao.update(key, utilisateurModif, () => {
        user_dao.findAll((err, res) => {
            console.log(err, res);
            testDelete();
        })
    });
}

// Suppression de données puis on affiche la table pour vérifier la bonne suppression
function testDelete() {
    console.log("[+] Test de la suppression :\t");
    var key = ["johndoe@test.com"]
    user_dao.delete(key, () => {
        user_dao.findAll((err, res) => {
            console.log(err, res);
        })
    });
}


begintest()
