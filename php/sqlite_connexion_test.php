<?php
include('SqliteConnection.php');
include('Utilisateur.php');
include('UtilisateurDAO.php');

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
echo("\n");

// Utilisateurs de test
$user = new Utilisateur;
$user->init("John", "Doe", "12/01/1983", "M", 190, 95, "johndoe@test.com", "pass");

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
echo("\n");

?>