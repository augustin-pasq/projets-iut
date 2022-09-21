<?php
include('SqliteConnection.php');
include('Utilisateur.php');
include('UtilisateurDAO.php');

$db = SqliteConnection::getInstance()->getConnection();
        
// Affichage du nom de la première table de la base de données pour vérifier la bonne connexion à la base
$query = "SELECT name FROM sqlite_master WHERE type='table'";
$stmt = $db->prepare($query);
$stmt->execute();
$affichage = $stmt->fetch(PDO::FETCH_ASSOC);
foreach ($affichage as $value) {
    echo "Première table : ".$value, "\n";
}

// Test de l'insertion
$user = new Utilisateur;
$user ->init("John", "Doe", "12/01/1983", "M", 190, 95, "johndoe@test.com", "pass");
echo $user;
$gestionUser =  UtilisateurDAO::getInstance();
$gestionUser->insert($user);

// Test de la bonne exécution de l'insertion
$query = "SELECT * FROM User";
$stmt = $db->prepare($query);
$stmt->execute();
$affichage = $stmt->fetch(PDO::FETCH_ASSOC);
foreach ($affichage as $value) {
    echo "Affichage de la table User : ".$value, "\n";
}

// Test de l'update
$user->setWeight(90);
$gestionUser->update($user);


// Test du delete
$gestionUser ->delete($user);

?>