<?php

include __ROOT__."/views/header.html";



if($data['hasAccount'] == true) echo "Vous avez déjà un compte";
if($data['hasAccount'] == false) echo "Bienvenue";
?>
