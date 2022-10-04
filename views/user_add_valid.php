<?php

include __ROOT__."/views/header.html";

?>

<div class="main-container" id="homepage">
    <h1>Bienvenue <?php echo $data['fname']; ?> !</h1>
    <p id="updated">Vous êtes désormais inscrit à SportTrack</p>
</div>

<div class="all-buttons" id="register">
    <a href="/upload"><div class="buttons-menu" id="register-button-menu"><img src="images/upload.png"><br>Importer des données</div></a>
    <a href="/user_update"><div class="buttons-menu" id="register-button-menu"><img src="images/profile.png"><br>Modifier mon profil</div></a>
    <a href="/disconnect"><div class="buttons-menu" id="register-button-menu"><img src="images/disconnect.png"><br>Me déconnecter</div></a>
</div>