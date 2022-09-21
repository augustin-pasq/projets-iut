<?php
require_once('SqliteConnection.php');
class UtilisateurDAO {
    private static UtilisateurDAO $dao;

    private function __construct() {}

    public static function getInstance(): UtilisateurDAO {
        if(!isset(self::$dao)) {
            self::$dao= new UtilisateurDAO();
        }
        return self::$dao;
    }

    public final function findAll(): Array{
        $dbc = SqliteConnection::getInstance()->getConnection();
        $query = "SELECT * FROM User ORDER BY lname,fname";
        $stmt = $dbc->query($query);
        $results = $stmt->fetchALL(PDO::FETCH_CLASS, 'User');
        return $results;
    }

    public final function insert(Utilisateur $st): void{
        if($st instanceof Utilisateur){
            $dbc = SqliteConnection::getInstance()->getConnection();
            /* prepare the SQL statement
             * The above example shows that no column list have been specified after the table name. 
             * In such a cases, values for all columns have to supply.
            */
            $query = "INSERT INTO User VALUES (:l, :f, :b; :s, :h, :w; :e; :p)";
            $stmt = $dbc->prepare($query);

            // bind the paramaters
            $stmt->bindValue(':l',$st->getlName(),PDO::PARAM_STR);
            $stmt->bindValue(':f',$st->getfName(),PDO::PARAM_STR);
            $stmt->bindValue(':b',$st->getBirthdate(),PDO::PARAM_STR);
            $stmt->bindValue(':s',$st->getSex(),PDO::PARAM_STR);
            $stmt->bindValue(':h',$st->getHeight(),PDO::PARAM_STR);
            $stmt->bindValue(':w',$st->getWeight(),PDO::PARAM_STR);
            $stmt->bindValue(':e',$st->getEmail(),PDO::PARAM_STR);
            $stmt->bindValue(':p',$st->getPassword(),PDO::PARAM_STR);

            // execute the prepared statement
            $stmt->execute();
        }
    }

    public function delete(Utilisateur $obj): void { 
        if($st instanceof Utilisateur){
            $dbc = SqliteConnection::getInstance()->getConnection();
            // prepare the SQL statement
            $query = "DELETE FROM User WHERE email=(:e)";
            $stmt = $dbc->prepare($query);

            // bind the paramaters
            $stmt->bindValue(':e',$st->getEmail(),PDO::PARAM_STR);

            // execute the prepared statement
            $stmt->execute();
        }
    }

    public function update(Utilisateur $obj): void {
        if($st instanceof Utilisateur){
            $dbc = SqliteConnection::getInstance()->getConnection();
            // prepare the SQL statement
            $query = "UPDATE User SET lname = :e, fname = :f, birthdate = :b; sex = :s, height = :h, weight = :w, password = :p WHERE email=:e";
            $stmt = $dbc->prepare($query);

            // bind the paramaters
            $stmt->bindValue(':l',$st->getlName(),PDO::PARAM_STR);
            $stmt->bindValue(':f',$st->getfName(),PDO::PARAM_STR);
            $stmt->bindValue(':b',$st->getBirthdate(),PDO::PARAM_STR);
            $stmt->bindValue(':s',$st->getSex(),PDO::PARAM_STR);
            $stmt->bindValue(':h',$st->getHeight(),PDO::PARAM_STR);
            $stmt->bindValue(':w',$st->getWeight(),PDO::PARAM_STR);
            $stmt->bindValue(':e',$st->getEmail(),PDO::PARAM_STR);
            $stmt->bindValue(':p',$st->getPassword(),PDO::PARAM_STR);

            // execute the prepared statement
            $stmt->execute();


        }
    }
}
?>