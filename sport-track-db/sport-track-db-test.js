const { db, user_dao, activity_dao, activity_entry_dao } = require('./sport-track-db');

// Affichage des nom des tables de la base de données pour vérifier la bonne connexion à la base
async function testConnexion() {
    console.log("[+] Test de la connexion :\t");
    return new Promise(function (resolve, reject) {
        db.all("SELECT name FROM sqlite_master WHERE type='table';", function (err, rows) {
            if (err) reject("Read error: " + err.message)
            else {
                resolve(rows)
            }
        })
    })
}

async function testUser() {

    // Permet de vider les tables pour pouvoir réexecuter deux fois les tests sans avoir de problèle de clé primaire
    await clearDatabase();
    console.log("--------------------------------- user_dao ---------------------------------");
    // Insertion de données puis on les affiche pour vérifier la bonne insertion
    console.log("[+] Test de l'insertion :\t");
    var user = ["John", "Doe", "12/01/1983", "M", 190, 95, "johndoe@test.com", "pass"];
    await user_dao.insert(user);
    var result = await user_dao.findAll();
    console.log(result);

    // Modification de données puis on les affiche pour vérifier la bonne modification
    console.log("[+] Test de la modification :\t");
    var userUpdate = ["John", "Doe", "12/01/1983", "M", 190, 90];
    var key = "johndoe@test.com"
    await user_dao.update(userUpdate, key);
    var result = await user_dao.findAll();
    console.log(result);

    // Suppression de données puis on affiche la table pour vérifier la bonne suppression
    console.log("[+] Test de la suppression :\t");
    var key = ["johndoe@test.com"]
    await user_dao.delete(key);
    var result = await user_dao.findAll();
    console.log(result);
}

async function testActivity() {

    // Permet de vider les tables pour pouvoir réexecuter deux fois les tests sans avoir de problèle de clé primaire
    await clearDatabase();
    console.log("--------------------------------- activity_dao ---------------------------------");
    // Insertion d'un utilisateur pour les tests
    var user = ["John", "Doe", "12/01/1983", "M", 190, 95, "johndoe@test.com", "pass"];
    await user_dao.insert(user);

    // Insertion de données puis on les affiche pour vérifier la bonne insertion
    console.log("[+] Test de l'insertion :\t");
    var activity = ["21/04/2018", "Petit entraînement tranquille au soleil", 4596, "johndoe@test.com"];
    await activity_dao.insert(activity);
    var result = await activity_dao.findAll();
    console.log(result);

    // Modification de données puis on les affiche pour vérifier la bonne modification
    console.log("[+] Test de la modification :\t");
    var activityUpdate = ["21/04/2018", "Entrainement, épuisé sous un soleil de plomb", 4596];
    var key = "johndoe@test.com";
    await activity_dao.update(activityUpdate, key);
    var result = await activity_dao.findAll();
    console.log(result);

    // Suppression de données puis on affiche la table pour vérifier la bonne suppression
    console.log("[+] Test de la suppression :\t");
    var activityDelete = ["21/04/2018", "Entrainement, épuisé sous un soleil de plomb", 4596];
    var key = ["johndoe@test.com"];
    await activity_dao.delete(activityDelete, key);
    var result = await activity_dao.findAll();
    console.log(result);

    // Insertion de plusieurs activités et affichage de toutes les activités de johnedoe@test.com
    console.log("[+] Test de l'affichage de toutes les activités liés à l'utilisateur John Doe :\t");
    var activity1 = ["22/04/2018", "Il a plu, il y avait beaucoup de grenouilles près de la mare", 770, "johndoe@test.com"];
    activity_dao.insert(activity1);
    var activity2 = ["21/04/2018", "Sortie avec le club", 1265, "rolland@aol.com"];
    activity_dao.insert(activity2);
    var activity3 = ["22/04/2018", "Une éclaircie maintenant, faut profiter pour sortir", 9842, "johndoe@test.com"];
    activity_dao.insert(activity3);
    var activity4 = ["22/04/2018", "Un arc-en-ciel au dessus de moi", 12789, "thomas@test.com"];
    activity_dao.insert(activity4);
    var key = ["johndoe@test.com"];
    result = await activity_dao.findActivitiesByUser(key);
    console.log(result);
}

async function testActivityEntry() {

    // Permet de vider les tables pour pouvoir réexecuter deux fois les tests sans avoir de problèle de clé primaire
    await clearDatabase();
    console.log("--------------------------------- activity_entry_dao ---------------------------------");
    // Insertion d'un utilisateur et d'une activité pour les tests
    var user = ["John", "Doe", "12/01/1983", "M", 190, 95, "johndoe@test.com", "pass"];
    await user_dao.insert(user);
    var activity = ["21/04/2018", "Petit entraînement tranquille au soleil", 4596, "johndoe@test.com"];
    await activity_dao.insert(activity);

    // Insertion de données puis on les affiche pour vérifier la bonne insertion
    console.log("[+] Test de l'insertion :\t");
    var dataActivity = ["14:10:00", 72, 47.644795, -2.776605, 25, 1];
    await activity_entry_dao.insert(dataActivity);
    var result = await activity_entry_dao.findAll();
    console.log(result);

    // Modification de données puis on les affiche pour vérifier la bonne modification
    console.log("[+] Test de la modification :\t");
    var dataActivityUpdate = ["14:10:00", 74, 47.644795, -2.776605, 25];
    var key = 1
    await activity_entry_dao.update(dataActivityUpdate, key);
    var result = await activity_entry_dao.findAll();
    console.log(result);

    // Suppression de données puis on affiche la table pour vérifier la bonne suppression
    console.log("[+] Test de la suppression :\t");
    var dataActivityDelete = ["14:10:00", 74, 47.644795, -2.776605, 25];
    var key = 1
    await activity_entry_dao.delete(dataActivityDelete, key);
    var result = await activity_entry_dao.findAll();
    console.log(result);
}

async function clearDatabase() {
    data_activity = new Promise(function (resolve, reject) {
        db.run('DELETE FROM DataActivity;',
            function (err) {
                if (err) reject(err.message)
                else resolve(true)
            })
    })
    activity = new Promise(function (resolve, reject) {
        db.run('DELETE FROM Activity;',
            function (err) {
                if (err) reject(err.message)
                else resolve(true)
            })
    })
    user = new Promise(function (resolve, reject) {
        db.run('DELETE FROM User;',
            function (err) {
                if (err) reject(err.message)
                else resolve(true)
            })
    })
    return [data_activity, activity, user];
}

async function testDatabase() {
    console.log(await testConnexion());
    await testUser();
    await testActivity();
    await testActivityEntry();
}

testDatabase();