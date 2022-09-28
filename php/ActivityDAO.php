<?php

require_once('SqliteConnection.php');

class ActivityDAO {

    private static ActivityDAO $dao;

    private function __construct() {}

    public static function getInstance(): ActivityDAO {
        if(!isset(self::$dao)) { self::$dao= new ActivityDAO(); }
        return self::$dao;
    }

    public final function findAll(): Array {
        $dbc = SqliteConnection::getInstance()->getConnection();
        $query = "SELECT * FROM Activity ORDER BY date";
        $stmt = $dbc->query($query);
        $results = $stmt->fetchALL(PDO::FETCH_CLASS, 'Activity');
        return $results;
    }

    public final function insert(Activity $st): void {
        if($st instanceof Activity) {
            
            $da = $st->getDate();
            $de = $st->getDescription();
            $di = $st->getDistance();
            $m = $st->getMailUser();

            $dbc = SqliteConnection::getInstance()->getConnection();
            $query = "INSERT INTO Activity (date, description, distance, activityUser) VALUES ('$da', '$de', '$di', '$m')";
            $stmt = $dbc->prepare($query);
            $stmt->execute();
        }
    }

    public function update(Activity $st): void {
        if($st instanceof Activity) {

            $da = $st->getDate();
            $de = $st->getDescription();
            $di = $st->getDistance();
            $m = $st->getMailUser();
            
            $dbc = SqliteConnection::getInstance()->getConnection();
            $query = "UPDATE Activity SET date = '$da', description = '$de', distance = '$di', activityUser = '$m'";
            $stmt = $dbc->prepare($query); 
            $stmt->execute();
        }
    }
    
    public function delete(Activity $st): void { 
        if($st instanceof Activity){

            $da = $st->getDate();
            $de = $st->getDescription();
            $di = $st->getDistance();
            $m = $st->getMailUser();
            
            $dbc = SqliteConnection::getInstance()->getConnection();
            $query = "DELETE FROM Activity WHERE date = '$da' AND description = '$de' AND distance = '$di' AND activityUser = '$m'";
            $stmt = $dbc->prepare($query);
            $stmt->execute();
        }
    }

    /**
     * Permet de connaître tous les activités d'un utilisateur en particulier
     */
    public function findAllActivity(Utilisateur $st): array { 
        if($st instanceof Utilisateur){

            $e = $st->getEmail();

            $dbc = SqliteConnection::getInstance()->getConnection();
            $query = "SELECT * FROM Activity WHERE activityUser = '$e'";
            $stmt = $dbc->prepare($query);
            $stmt->execute();

            $affichage = $stmt->fetchAll(PDO::FETCH_ASSOC);

            
        }
        return $affichage;
    }
}

?>