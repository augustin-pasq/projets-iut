<?php 

/** Supprimer la variable d’environnement servant à identifier l’utilisateur */
unset($_SESSION['id']);

/** Détruire la session utilisateur */
session_destroy();

include __ROOT__."/views/header.html"; ?>

<h1>Vous êtes bien déconnecté de l'application</h1>
