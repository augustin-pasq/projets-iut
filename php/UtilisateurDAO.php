<?php

require_once('SqliteConnection.php');

class UtilisateurDAO {

    private static UtilisateurDAO $dao;

    private function __construct() {}

    public static function getInstance(): UtilisateurDAO {
        if(!isset(self::$dao)) { self::$dao= new UtilisateurDAO(); }
        return self::$dao;
    }

    public final function findAll(): Array {
        $dbc = SqliteConnection::getInstance()->getConnection();
        $query = "SELECT * FROM User ORDER BY lname,fname";
        $stmt = $dbc->query($query);
        $results = $stmt->fetchALL(PDO::FETCH_CLASS, 'Utilisateur');
        return $results;
    }

    public final function findUser($email): Array {
        $result = null;

        $dbc = SqliteConnection::getInstance()->getConnection();
        $query = "SELECT * FROM User WHERE email = '$email'";
        $stmt = $dbc->query($query);
        $result = $stmt->fetchALL(PDO::FETCH_CLASS, 'Utilisateur');
    
        return $result;
    }

    public final function insert(Utilisateur $st): void {
        if($st instanceof Utilisateur) {
            
            $l = $st->getlName();
            $f = $st->getfName();
            $b = $st->getBirthdate();
            $s = $st->getSex();
            $h = $st->getHeight();
            $w = $st->getWeight();
            $e = $st->getEmail();
            $p = $st->getPassword();

            /*
             * PASSWORD_DEFAULT - Utilise l'algorithme bcrypt (par défaut depuis PHP 5.5.0). 
             * Cette constante est conçue pour changer avec le temps, au fur et à mesure que de nouveaux algorithmes 
             * plus puissants sont ajoutés à PHP. Pour cette raison, la longueur du résultat de l'utilisation de cet identifiant 
             * peut changer dans le temps.
             */
            $p = password_hash($p, PASSWORD_DEFAULT);

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

            
            $dbc = SqliteConnection::getInstance()->getConnection();
            $query = "UPDATE User SET lname = '$l', fname = '$f', birthdate = '$b', sex = '$s', height = $h, weight = $w WHERE email='$e'";
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