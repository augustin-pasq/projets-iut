<?php
class SqliteConnection {
    private static SqliteConnection $connexion;

    public static function getInstance(): SqliteConnection {
        if(!isset(self::$connexion)) {
            self::$connexion= new SqliteConnection();
        }
        return self::$connexion;
    }

    public function getConnection(){
        
        /* Connexion à une base MySQL avec l'invocation de pilote */
        $dsn = 'sqlite:../database/sport_track.db';

        $db = new PDO($dsn);
        // Permettre à l'API PDO de pouvoir lancer des exception
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        // Pouvoir accéder à la bdd dans les autres méthodes
        return $db;

    }
}
?>