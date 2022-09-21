<?php
include('SqliteConnection.php');
include('Utilisateur.php');
include('UtilisateurDAO.php');

$db = SqliteConnection::getInstance()->getConnection();
        
// Si vous êtes déjà connecté à SQLite, vous pouvez savoir de quelle version il s'agit avec la fonction version_number()
$query = "SELECT sqlite_version();";
$stmt = $db->prepare($query);
$stmt->execute();
$affichage = $stmt->fetch(PDO::FETCH_ASSOC);
foreach ($affichage as $value) {
    echo "Version du SQLite : ".$value, "\n";
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