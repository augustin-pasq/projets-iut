<?php

include __ROOT__."/views/header.html";



if($data['hasAccount'] == true) echo "Vous avez déjà un compte";
if($data['hasAccount'] == false) echo "Bienvenue";

echo '<html>
<br>
<a href="/upload">Importer des données</a>
<a href="/disconnect">Se déconnecter</a>
<a href="/user_update">Modification du profil</a>
</html>';
?>