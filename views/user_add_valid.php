<?php

include __ROOT__."/views/header.html";

echo "Nom : " . $data['lname'];
echo "Prénom : " . $data['fname'];
echo "Date de naissance : " . $data['birthdate'];
echo "Sexe : " . $data['sex'];
echo "Taille : " . $data['height'];
echo "Poids : " . $data['weight'];
echo "Adresse mail : " . $data['email'];
echo "Mot de passe : " . $data['password'];

?>
