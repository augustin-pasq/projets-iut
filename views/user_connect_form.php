<?php include __ROOT__."/views/header.html"; ?>
<link rel="stylesheet" href="../css/login.css">


<div id="parent">
  <form id="form_login" action="/connect" method="post" autocomplete="on"> 
    <h1>Connexion</h1>
    <label>Adresse mail</label><br>
    <input type="email" id="email" name="email" placeholder="exemple@exemple.com" required><br><br>
    <label>Mot de passe</label><br>
    <input type="password" id="password" name="password" placeholder="Taper le mot de passe" required><br>
    <input type="submit" value="Se connecter">
    <br>
    <br>
    <label id="interrogation"> Vous n'avez pas encore de compte ?</label><br>
    <br> 
    <br>
    <a id="inscrire" href="./register.html">S'inscrire</a>
  </form>
</div>
