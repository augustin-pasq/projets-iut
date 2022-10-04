<?php

include __ROOT__ . "/views/header.html";

?>

<div class="main-container" id="homepage">
    <h1>Bonjour <?php echo $data['fname']; ?> !</h1>
    <p id="updated">Vous êtes connecté à SportTrack</p>
</div>

<div class="all-buttons">
    <a href="/activities"><div class="buttons-menu"><img src="images/sports.png"><br>Afficher la liste de mes activités</div></a>
    <a href="/upload"><div class="buttons-menu"><img src="images/upload.png"><br>Importer des données</div></a>
    <a href="/user_update"><div class="buttons-menu"><img src="images/profile.png"><br>Modifier<br>mon profil</div></a>
    <a href="/disconnect"><div class="buttons-menu"><img src="images/disconnect.png"><br>Me<br>déconnecter</div></a>
</div>