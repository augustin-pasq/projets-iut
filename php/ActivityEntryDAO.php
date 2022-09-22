<?php

require_once('SqliteConnection.php');

class ActivityEntryDAO {

    private static ActivityEntryDAO $dao;

    private function __construct() {}

    public static function getInstance(): ActivityEntryDAO {
        if(!isset(self::$dao)) { self::$dao= new ActivityEntryDAO(); }
        return self::$dao;
    }

    public final function findAll(): Array {
        $dbc = SqliteConnection::getInstance()->getConnection();
        $query = "SELECT * FROM DataActivity ORDER BY idActivity";
        $stmt = $dbc->query($query);
        $results = $stmt->fetchALL(PDO::FETCH_CLASS, 'ActivityEntry');
        return $results;
    }

    public final function insert(ActivityEntry $st): void {
        if($st instanceof ActivityEntry) {
            
            $t = $st->getTime();
            $c = $st->getCardio();
            $la = $st->getLatitude();
            $lo = $st->getLongitude();
            $a = $st->getAltitude();
            $i = $st->getidActivity();

            $dbc = SqliteConnection::getInstance()->getConnection();
            $query = "INSERT INTO DataActivity (time, cardio_frequency,  latitude , longitude, altitude, idActivity) VALUES ('$t', '$c', '$la', '$lo', '$a', '$i')";
            $stmt = $dbc->prepare($query);
            $stmt->execute();
        }
    }

    public function update(ActivityEntry $st): void {
        if($st instanceof ActivityEntry) {

            $t = $st->getTime();
            $c = $st->getCardio();
            $la = $st->getLatitude();
            $lo = $st->getLongitude();
            $a = $st->getAltitude();
            $i = $st->getidActivity();
            
            $dbc = SqliteConnection::getInstance()->getConnection();
            $query = "UPDATE DataActivity SET time = '$t', cardio_frequency = '$c', latitude = '$la', longitude = '$lo', altitude = '$a', idActivity = '$i'";
            $stmt = $dbc->prepare($query); 
            $stmt->execute();
        }
    }
    
    public function delete(ActivityEntry $st): void { 
        if($st instanceof ActivityEntry){

            $dbc = SqliteConnection::getInstance()->getConnection();
            $query = "DELETE FROM DataActivity WHERE idActivity=(:i)";
            $stmt = $dbc->prepare($query);
    
            $stmt->bindValue(':i',$st->getidActivity(),PDO::PARAM_STR);
    
            $stmt->execute();
        }
    }

    /**
     * Permet de lister toutes les données
     */
    public function AllData(): array { 
        $dbc = SqliteConnection::getInstance()->getConnection();
        $query = "SELECT * FROM DataActivity";
        $stmt = $dbc->prepare($query);
        $stmt->execute();

        $affichage = $stmt->fetchAll(PDO::FETCH_ASSOC);

            
        return $affichage;
    }

    /**
     * Permet de connaître tous les données d'une activité en particulier
     */
    public function findAllData(Activity $st): array { 
        if($st instanceof Activity){

            $da = $st->getDate();
            $de = $st->getDescription();
            $m = $st->getMailUser();

            $dbc = SqliteConnection::getInstance()->getConnection();
            $query = "SELECT rowid FROM Activity WHERE date = '$da' AND description = '$de' AND activityUser = '$m'";
            $stmt = $dbc->prepare($query);
            $stmt->execute();

            $ArrayId = $stmt->fetch(PDO::FETCH_ASSOC);
            $id = $ArrayId["rowid"];

            $query = "SELECT * FROM DataActivity WHERE idActivity = '$id'";
            $stmt = $dbc->prepare($query);
            $stmt->execute();

            $affichage = $stmt->fetchAll(PDO::FETCH_ASSOC);

            
        }
        return $affichage;
    }
}

?>