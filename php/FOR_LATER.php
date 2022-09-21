<?php

function register() {
        
    // Vérifier si le formulaire est soumis 
    if (isset($_POST['submit'])) {
        
        // Récupérer les données du formulaire en utilisant la valeur des attributs name comme clé
        $lname = $_POST['lname'];
        $fname = $_POST['fname'];
        $birthdate = $_POST['birthdate'];
        $sex = $_POST['sex'];
        $height = $_POST['height'];
        $weight = $_POST['weight'];
        $email = $_POST['email'];
        $password = $_POST['password'];
    }
}

?>