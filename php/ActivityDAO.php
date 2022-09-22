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
            
            $l = $st->getlName();
            $f = $st->getfName();
            $b = $st->getBirthdate();
            $s = $st->getSex();
            $h = $st->getHeight();
            $w = $st->getWeight();
            $e = $st->getEmail();
            $p = $st->getPassword();

            $dbc = SqliteConnection::getInstance()->getConnection();
            $query = "INSERT INTO User (lname, fname, birthdate, sex, height, weight, email, password) VALUES ('$l', '$f', '$b', '$s', $h, $w, '$e', '$p')";
            $stmt = $dbc->prepare($query);
            $stmt->execute();
        }
    }

    public function update(Utilisateur $st): void {
        if($st instanceof Utilisateur) {

            $l = $st->getlName();
            $f = $st->getfName();
            $b = $st->getBirthdate();
            $s = $st->getSex();
            $h = $st->getHeight();
            $w = $st->getWeight();
            $e = $st->getEmail();
            $p = $st->getPassword();
            
            $dbc = SqliteConnection::getInstance()->getConnection();
            $query = "UPDATE User SET lname = '$l', fname = '$f', birthdate = '$b', sex = '$s', height = $h, weight = $w, password = '$p' WHERE email='$e'";
            $stmt = $dbc->prepare($query); 
            $stmt->execute();
        }
    }
    
    public function delete(Utilisateur $st): void { 
        if($st instanceof Utilisateur){
            
            $dbc = SqliteConnection::getInstance()->getConnection();
            $query = "DELETE FROM User WHERE email=(:e)";
            $stmt = $dbc->prepare($query);
    
            $stmt->bindValue(':e',$st->getEmail(),PDO::PARAM_STR);
    
            $stmt->execute();
        }
    }
}

?>