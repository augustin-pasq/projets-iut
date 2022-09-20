<?php
class SqliteConnection {


    public function getConnection(){
        
        /* Connexion à une base MySQL avec l'invocation de pilote */
        $dsn = 'mysql:dbname=sport-track;host=127.0.0.1';
        $user = '';
        $password = '';

        $dbh = new PDO($dsn, $user, $password);


    }

    $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
}
?>