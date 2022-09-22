<?php

class Utilisateur {
    
    private string $lname;
    private string $fname;
    private string $birthdate;
    private string $sex;
    private int $height;
    private int $weight;
    private string $email;
    private string $password;

    public function  __construct() {}
    
    public function init($l, $f, $b, $s, $h, $w, $e, $p) {
        $this->lname = $l;
        $this->fname = $f;
        $this->birthdate = $b;
        $this->sex = $s;
        $this->height = $h;
        $this->weight = $w;
        $this->email = $e;
        /*
         PASSWORD_DEFAULT - Utilise l'algorithme bcrypt (par défaut depuis PHP 5.5.0). 
         Cette constante est conçue pour changer avec le temps, au fur et à mesure que de nouveaux algorithmes 
         plus puissants sont ajoutés à PHP. Pour cette raison, la longueur du résultat de l'utilisation de cet identifiant 
         peut changer dans le temps.
        */
        $this->password = password_hash($p, PASSWORD_DEFAULT);
    }

    function getlName(): string { return $this->lname; }
    function getfName(): string { return $this->fname; }
    function getBirthdate(): string { return $this->birthdate; }
    function getSex(): string { return $this->sex; }
    function getHeight(): int { return $this->height; }
    function getWeight(): int { return $this->weight; }
    function getEmail(): string { return $this->email; }
    function getPassword(): string { return $this->password; }

    function setlName(string $lname) { $this->lname = $lname; }
    function setfName(string $fname) { $this->fname = $fname; }
    function setBirthdate(string $birthdate) { $this->birthdate = $birthdate; }
    function setSex(string $sex) { $this->sex = $sex; }
    function setHeight(int $height) { $this->height = $height; }
    function setWeight(int $weight) { $this->weight = $weight; }
    function setEmail(string $email) { $this->email = $email; }
    function setPassword(string $password) { $this->password = password_hash($password, PASSWORD_DEFAULT); }

    public function  __toString(): string {
        return "Nom : " . $this->lname . " | Prenom : " . $this->fname . " | Anniversaire : " . $this->birthdate . " | Sexe : " . $this->sex . " | Taille : " . $this->height . " | Poids : " . $this->weight . " | Email : " . $this->email . "\n";
    }
}

?>