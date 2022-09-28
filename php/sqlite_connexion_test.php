<?php
include('SqliteConnection.php');
include('Utilisateur.php');
include('UtilisateurDAO.php');
include('Activity.php');
include('ActivityDAO.php');
include('ActivityEntry.php');
include('ActivityEntryDAO.php');

$db = SqliteConnection::getInstance()->getConnection();
        
// Affichage du des tables de la base de données pour vérifier la bonne connexion à la base
echo("[+] Test de la connexion :\t");
$query = "SELECT name FROM sqlite_master WHERE type='table';";
$stmt = $db->prepare($query);
$stmt->execute();
$affichage = $stmt->fetchAll(PDO::FETCH_ASSOC);
foreach ($affichage as $value) {
    foreach ($value as $key => $name) {
        echo($name . " | ");
    }
}
echo("\n\n");

// Utilisateurs de test
$user = new Utilisateur;
$user->init("John", "Doe", "12/01/1983", "M", 190, 95, "johndoe@test.com", "pass");
echo("[+] Test de la classe Utilisateur\n");

// Insertion de données puis on les affiche pour vérifier la bonne insertion
echo("[+] Test de l'insertion :\t");
$gestionUser =  UtilisateurDAO::getInstance();
$gestionUser->insert($user);

$query = "SELECT * FROM User";
$stmt = $db->prepare($query);
$stmt->execute();
$affichage = $stmt->fetchAll(PDO::FETCH_ASSOC);
foreach ($affichage as $value) {
    foreach ($value as $key => $name) {
        echo($name . " | ");
    }
}
echo("\n");

// Modification de données puis on les affiche pour vérifier la bonne modification
echo("[+] Test de la modification :\t");
$user->setWeight(90);
$gestionUser->update($user);

$query = "SELECT * FROM User";
$stmt = $db->prepare($query);
$stmt->execute();
$affichage = $stmt->fetchAll(PDO::FETCH_ASSOC);
foreach ($affichage as $value) {
    foreach ($value as $key => $name) {
        echo($name . " | ");
    }
}
echo("\n");

// Suppression de données puis on affiche la table pour vérifier la bonne suppression
echo("[+] Test de la suppression :\t");
$gestionUser ->delete($user);

$query = "SELECT * FROM User";
$stmt = $db->prepare($query);
$stmt->execute();
$affichage = $stmt->fetchAll(PDO::FETCH_ASSOC);
foreach ($affichage as $value) {
    foreach ($value as $key => $name) {
        echo($name . " | ");
    }
}
echo("\n\n");


// Activité de test
// SCRIPT POUR VIDER LA TABLE ET BYPASS LA CONTRAINE D'UNICITE
$query = "DELETE FROM Activity";
$stmt = $db->prepare($query);
$stmt->execute();

echo("[+] Test de la classe Activity\n");
$activity = new Activity;
$activity->init("21/04/2018", "Petit entraînement tranquille au soleil", 4596, "johndoe@test.com");

// Insertion de données puis on les affiche pour vérifier la bonne insertion
echo("[+] Test de l'insertion :\t");
$gestionActivity =  ActivityDAO::getInstance();
$gestionActivity->insert($activity);

$query = "SELECT * FROM Activity";
$stmt = $db->prepare($query);
$stmt->execute();
$affichage = $stmt->fetchAll(PDO::FETCH_ASSOC);
foreach ($affichage as $value) {
    foreach ($value as $key => $name) {
        echo($name . " | ");
    }
}
echo("\n");

// Modification de données puis on les affiche pour vérifier la bonne modification
echo("[+] Test de la modification :\t");
$activity->setDescription("Entrainement épuisé sous un soleil de plomb");
$gestionActivity->update($activity);

$query = "SELECT * FROM Activity";
$stmt = $db->prepare($query);
$stmt->execute();
$affichage = $stmt->fetchAll(PDO::FETCH_ASSOC);
foreach ($affichage as $value) {
    foreach ($value as $key => $name) {
        echo($name . " | ");
    }
}
echo("\n");

// Suppression de données puis on affiche la table pour vérifier la bonne suppression
echo("[+] Test de la suppression :\t");
$gestionActivity ->delete($activity);

$query = "SELECT * FROM Activity";
$stmt = $db->prepare($query);
$stmt->execute();
$affichage = $stmt->fetchAll(PDO::FETCH_ASSOC);
foreach ($affichage as $value) {
    foreach ($value as $key => $name) {
        echo($name . " | ");
    }
}
echo("\n");

// Obtention de toutes les activités sportives d'un utilisateur en particulier
echo("[+] Test de l'affichage de toutes les activités liés à l'utilisateur John Doe :\n");


$activity2 = new Activity;
$activity2->init("22/04/2018", "Il a plu, il y avait beaucoup de grenouilles près de la mare", 770, "johndoe@test.com");
$gestionActivity->insert($activity2);

$activity3 = new Activity;
$activity3->init("21/04/2018", "Sortie avec le club", 1265, "rolland@aol.com");
$gestionActivity->insert($activity3);

$activity4 = new Activity;
$activity4->init("22/04/2018", "Une éclaircie maintenant, faut profiter pour sortir", 9842, "johndoe@test.com");
$gestionActivity->insert($activity4);

$activity5 = new Activity;
$activity5->init("22/04/2018", "Un arc-en-ciel au dessus de moi", 12789, "thomas@test.com");
$gestionActivity->insert($activity5);

$affichage = $gestionActivity->findAllActivity($user);
foreach ($affichage as $value) {
    foreach ($value as $key => $name) {
        echo($name . " | ");
    }
    echo("\n");
}

echo("\n\n");

// Activité de test
// SCRIPT POUR VIDER LA TABLE ET BYPASS LA CONTRAINE D'UNICITE
$query = "DELETE FROM DataActivity";
$stmt = $db->prepare($query);
$stmt->execute();

echo("[+] Test de la classe ActivityEntry\n");
$activityEntry = new ActivityEntry;
$activityEntry->init("14:10:00", 72, 47.644795, -2.776605, 25, 1);

// Insertion de données puis on les affiche pour vérifier la bonne insertion
echo("[+] Test de l'insertion :\t");
$gestionActivityEntry =  ActivityEntryDAO::getInstance();
$gestionActivityEntry->insert($activityEntry);

$query = "SELECT * FROM DataActivity";
$stmt = $db->prepare($query);
$stmt->execute();
$affichage = $stmt->fetchAll(PDO::FETCH_ASSOC);
foreach ($affichage as $value) {
    foreach ($value as $key => $name) {
        echo($name . " | ");
    }
}
echo("\n");

// Modification de données puis on les affiche pour vérifier la bonne modification
echo("[+] Test de la modification :\t");
$activityEntry->setCardio("74");
$gestionActivityEntry->update($activityEntry);

$query = "SELECT * FROM DataActivity";
$stmt = $db->prepare($query);
$stmt->execute();
$affichage = $stmt->fetchAll(PDO::FETCH_ASSOC);
foreach ($affichage as $value) {
    foreach ($value as $key => $name) {
        echo($name . " | ");
    }
}
echo("\n");

// Suppression de données puis on affiche la table pour vérifier la bonne suppression
echo("[+] Test de la suppression :\t");
$gestionActivityEntry ->delete($activityEntry);

$query = "SELECT * FROM DataActivity";
$stmt = $db->prepare($query);
$stmt->execute();
$affichage = $stmt->fetchAll(PDO::FETCH_ASSOC);
foreach ($affichage as $value) {
    foreach ($value as $key => $name) {
        echo($name . " | ");
    }
}
echo("\n");

// Lister l'ensemble des données
echo("[+] Lister l'ensemble des données :\n");
$activityEntry2 = new ActivityEntry;
$activityEntry2->init("15:25:30", 100, 42.117281, -10.162761, 23, 1);
$gestionActivityEntry->insert($activityEntry2);

$activityEntry3 = new ActivityEntry;
$activityEntry3->init("15:25:35", 103, 42.117295, -10.162790, 22, 1);
$gestionActivityEntry->insert($activityEntry3);

$activityEntry4 = new ActivityEntry;
$activityEntry4->init("15:25:40", 102, 42.117356, -10.16212, 21, 1);
$gestionActivityEntry->insert($activityEntry4);

$activityEntry5 = new ActivityEntry;
$activityEntry5->init("17:09:12", 64, 58.891122, -50.2828921, 304, 2);
$gestionActivityEntry->insert($activityEntry5);

$affichage = $gestionActivityEntry->AllData();
foreach ($affichage as $value) {
    foreach ($value as $key => $name) {
        echo($name . " | ");
    }
    echo("\n");
}


// Obtention de toutes les données d'une activité en particulier
echo("[+] Test de l'affichage de toutes les données liés à l'activité :");
echo $activity2;

$affichage = $gestionActivityEntry->findAllData($activity2);
foreach ($affichage as $value) {
    foreach ($value as $key => $name) {
        echo($name . " | ");
    }
    echo("\n");
}

?>