<?php
class SqliteConnection {
    private PDO $connexion;
    private static SqliteConnection $instance;


    private function __construct() {
        /* Connexion à une base MySQL avec l'invocation de pilote */
        $dsn = 'sqlite:'.dirname(__DIR__).'/database/sport_track.db';

        $db = new PDO($dsn);
        // Permettre à l'API PDO de pouvoir lancer des exception
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        // Pouvoir accéder à la bdd dans les autres méthodes
        $this->connexion = $db;
    }

    public static function getInstance(): SqliteConnection {
        if(!isset(self::$instance)) {
            self::$instance= new SqliteConnection();
        }
        return self::$instance;
    }

    public function getConnection(){
        return $this->connexion;

    }
}
?>