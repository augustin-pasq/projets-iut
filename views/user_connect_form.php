<?php include __ROOT__ . "/views/header.html"; ?>

<form id="form_login" action="/connect" method="post" autocomplete="on">
  <h1>Connexion</h1>
  <?php if(!$data['badCredentials']) echo "<p id='badCredentials'>Identifiant ou mot de passe incorrect</p>" ?>
  <label>Adresse mail</label>
  <input type="email" id="email" name="email" placeholder="exemple@exemple.com" required>
  <label>Mot de passe</label>
  <input type="password" id="password" name="password" placeholder="Taper le mot de passe" required>
  <input type="submit" value="Se connecter">
</form>
<p> Vous n'avez pas encore de compte ? <a id="register" href="/user_add">S'inscrire</a></P>