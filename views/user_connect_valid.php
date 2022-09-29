<?php

include __ROOT__."/views/header.html";



if( $_SESSION["id"] != null) {
    echo "Vous êtes connecté à l'application";
    
    echo '<html>
    <br>
    <br>
    <a href="/activities">Liste des activités</a>
    <a href="/upload">Importer des données</a>
    <a href="/disconnect">Se déconnecter</a>
    <a href="/user_update">Modification du profil</a>
    </html>';
}




?>


<?php if( $_SESSION["id"] == null) {
    echo "Vous n'êtes pas connecté à l'application.";
    echo "L'adresse mail et/ou le mot de passe est incorrect.";
    
}?>
