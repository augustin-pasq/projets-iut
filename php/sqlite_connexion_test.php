<?php
include('SqliteConnection.php');
include('Utilisateur.php');
include('UtilisateurDAO.php');
include('Activity.php');
include('ActivityDAO.php');

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
$activity->init("21/04/2018", "Petit entraînement tranquille au soleil", "johndoe@test.com");

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
$activity2->init("22/04/2018", "Il a plu, il y avait beaucoup de grenouilles près de la mare", "johndoe@test.com");
$gestionActivity->insert($activity2);

$activity3 = new Activity;
$activity3->init("21/04/2018", "Sortie avec le club", "rolland@aol.com");
$gestionActivity->insert($activity3);

$activity4 = new Activity;
$activity4->init("22/04/2018", "Une éclaircie maintenant, faut profiter pour sortir", "johndoe@test.com");
$gestionActivity->insert($activity4);

$activity5 = new Activity;
$activity5->init("22/04/2018", "Un arc-en-ciel au dessus de moi", "thomas@test.com");
$gestionActivity->insert($activity5);

$affichage = $gestionActivity->findAllActivity($user);
foreach ($affichage as $value) {
    foreach ($value as $key => $name) {
        echo($name . " | ");
    }
    echo("\n");
}

echo("\n\n");



?>