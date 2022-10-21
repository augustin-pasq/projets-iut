<?php include __ROOT__ . "/views/header.html"; ?>

<div class="main-container" id="homepage">
    <h1>Bonjour <?php echo $data['fname']; ?> !</h1>
    <p class="success-message">Vous êtes connecté à SportTrack</p>
</div>

<div class="all-buttons" id="logged-in">
    <a href="/activities"><div><img src="images/sports.png"><br>Afficher la liste de mes activités</div></a>
    <a href="/upload"><div><img src="images/upload.png"><br>Importer des données</div></a>
    <a href="/user_update"><div><img src="images/profile.png"><br>Modifier<br>mon profil</div></a>
    <a href="/disconnect"><div><img src="images/disconnect.png"><br>Me<br>déconnecter</div></a>
</div>