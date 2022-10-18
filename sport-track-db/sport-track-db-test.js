const { db, user_dao, activity_dao, activity_entry_dao } = require('./sport-track-db');

// Affichage des nom des tables de la base de données pour vérifier la bonne connexion à la base
function testConnexion() {
    console.log("[+] Test de la connexion :\t");
    db.all("SELECT name FROM sqlite_master WHERE type='table';", (err, data) => {
        if (err)
            throw err
        console.log(data)
        testUser_dao()
    })
}
/* ------------------------------------------------------------------------ user_dao -------------------------------------------------------------------------------------------- */

// Permet de vider la table User pour pouvoir réexecuter deux fois les tests sans avoir de problèle de clé primaire
function testUser_dao(callback) {
    db.run('DELETE FROM User;')
    testInsertUser();
}

// Insertion de données puis on les affiche pour vérifier la bonne insertion
function testInsertUser() {
    var user = ["John", "Doe", "12/01/1983", "M", 190, 95, "johndoe@test.com", "pass"];
    console.log("[+] Test de l'insertion :\t");
    user_dao.insert(user, () => {
        console.log("Passage critique")
        user_dao.findAll((err, res) => {
            console.log(err, res);
            testUpdateUser();
        })
    });
}

// Modification de données puis on les affiche pour vérifier la bonne modification
function testUpdateUser() {
    var userUpdate = ["John", "Doe", "12/01/1983", "M", 190, 90];
    console.log("[+] Test de la modification :\t");
    var key = "johndoe@test.com"
    user_dao.update(key, userUpdate, () => {
        user_dao.findAll((err, res) => {
            console.log(err, res);
            testDeleteUser();
        })
    });
}

// Suppression de données puis on affiche la table pour vérifier la bonne suppression
function testDeleteUser() {
    console.log("[+] Test de la suppression :\t");
    var key = ["johndoe@test.com"]
    user_dao.delete(key, () => {
        user_dao.findAll((err, res) => {
            console.log(err, res);
            // testActivity_dao()
        })
    });
}

/* ------------------------------------------------------------------------ activity-dao -------------------------------------------------------------------------------------------- */

// Permet de vider la table Activity pour pouvoir réexecuter deux fois les tests sans avoir de problèle de clé primaire
function testActivity_dao() {
    db.run('DELETE FROM Activity;')
    testInsertActivity()
}


// Insertion de données puis on les affiche pour vérifier la bonne insertion
function testInsertActivity() {
    var activity = ["21/04/2018", "Petit entraînement tranquille au soleil", 4596, "johndoe@test.com"];
    console.log("[+] Test de l'insertion :\t");
    activity_dao.insert(activity, () => {
        console.log("Passage critique")
        activity_dao.findAll((err, res) => {
            console.log(err, res);
            testUpdateActivity();
        })
    });
}



// Modification de données puis on les affiche pour vérifier la bonne modification
function testUpdateActivity() {
    var activityUpdate = ["21/04/2018", "Entrainement, épuisé sous un soleil de plomb", 4596];
    console.log("[+] Test de la modification :\t");
    var key = "johndoe@test.com"
    activity_dao.update(key, activityUpdate, () => {
        activity_dao.findAll((err, res) => {
            console.log(err, res);
            testDeleteActivity();
        })
    });
}

// Suppression de données puis on affiche la table pour vérifier la bonne suppression
function testDeleteActivity() {
    console.log("[+] Test de la suppression :\t");
    var key = ["johndoe@test.com"]
    activity_dao.delete(key, () => {
        activity_dao.findAll((err, res) => {
            console.log(err, res);
            testFindActivity()
        })
    });
}

function testFindActivity() {
    console.log("[+] Test de l'affichage de toutes les activités liés à l'utilisateur John Doe :\t");

    var activity1 = ["22/04/2018", "Il a plu, il y avait beaucoup de grenouilles près de la mare", 770, "johndoe@test.com"]
    activity_dao.insert(activity1)

    var activity2 = ["21/04/2018", "Sortie avec le club", 1265, "rolland@aol.com"]
    activity_dao.insert(activity2)

    var activity3 = ["22/04/2018", "Une éclaircie maintenant, faut profiter pour sortir", 9842, "johndoe@test.com"]
    activity_dao.insert(activity3)

    var activity4 = ["22/04/2018", "Un arc-en-ciel au dessus de moi", 12789, "thomas@test.com"]
    activity_dao.insert(activity4)

    var key = ["johndoe@test.com"]
    activity_dao.findAllActivity(key, () => {
        activity_dao.findAll((err, res) => {
            console.log(err, res);
            // testActivity_entry_dao()
        })
    });
}

/* ------------------------------------------------------------------------ activity_entry_dao -------------------------------------------------------------------------------------------- */

// Permet de vider la table DataActivity pour pouvoir réexecuter deux fois les tests sans avoir de problèle de clé primaire
function testActivity_entry_dao() {
    db.run('DELETE FROM DataActivity;')
    testInsertData()
}


// Insertion de données puis on les affiche pour vérifier la bonne insertion
function testInsertData() {
    var dataActivity = ["14:10:00", 72, 47.644795, -2.776605, 25, 1];
    console.log("[+] Test de l'insertion :\t");
    activity_entry_dao.insert(dataActivity, () => {
        activity_entry_daofindAll((err, res) => {
            console.log(err, res);
            testUpdateData();
        })
    });
}



// Modification de données puis on les affiche pour vérifier la bonne modification
function testUpdateData() {
    var dataActivityUpdate = ["14:10:00", 74, 47.644795, -2.776605, 25, 1];
    console.log("[+] Test de la modification :\t");
    var key = 1
    activity_entry_dao.update(key, dataActivityUpdate, () => {
        activity_entry_dao.findAll((err, res) => {
            console.log(err, res);
            testDeleteData();
        })
    });
}

// Suppression de données puis on affiche la table pour vérifier la bonne suppression
function testDeleteData() {
    console.log("[+] Test de la suppression :\t");
    var key = 1
    activity_entry_dao.delete(key, () => {
        activity_entry_dao.findAll((err, res) => {
            console.log(err, res);
        })
    });
}


testConnexion()