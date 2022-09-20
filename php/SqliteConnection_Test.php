<?php
include('SqliteConnection.php');
class sqlite_connection_test{


    public function testOfConnexion () {
        $db = SqliteConnection::getInstance()->getConnection();
        
        // Si vous êtes déjà connecté à SQLite, vous pouvez savoir de quelle version il s'agit avec la fonction version_number()
        $query = "SELECT sqlite_version();";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $affichage = $stmt->fetch(PDO::FETCH_ASSOC);
        foreach ($affichage as $value) {
            echo $value, "\n";
        }
    }
}

/* TEST 
$a = new sqlite_connection_test();
$a->testOfConnexion();
*/

?>