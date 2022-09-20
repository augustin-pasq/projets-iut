<?php
class Utilisateur{
    private string $lname;
    private string $fname;
    private string $birthdate;
    private chr $sex;
    private int $height;
    private int $weight;
    private string $email;
    private string $password;


    public function  __construct() { }
    public function init($l, $f, $b, $s, $h, $w, $e, $p){
        $this->lname = $l;
        $this->fname = $f;
        $this->birthdate = $b;
        $this->sex = $s;
        $this->height = $h;
        $this->weight = $w;
        $this->email = $e;
        $this->password = $p;

    }

    public function register() {
        // Vérifier si le formulaire est soumis 
        if ( isset( $_POST['submit'] ) ) {
            /* récupérer les données du formulaire en utilisant 
            la valeur des attributs name comme clé 
            */
            $lname = $_POST['lname']; 
            $fname = $_POST['fname']; 
            $birthdate = $_POST['sex'];
            $sex = $_POST['sex']; 
            $height = $_POST['height']; 
            $weight = $_POST['weight'];
            $email = $_POST['email']; 
            $password = $_POST['password'];  
    }

    function getlName(): string { return $this->lname; }
    function getfName(): string { return $this->fname; }
    function getBirthdate(): string { return $this->birthdate; }
    function getSex(): string { return $this->sex; }
    function getHeight(): string { return $this->height; }
    function getWeight(): string { return $this->weight; }
    function getEmail(): string { return $this->email; }
    function getPassword(): string { return $this->password; }

    // public function  __toString(): string { return $this->nom. " ". $this->prenom; }
    }
}
?>