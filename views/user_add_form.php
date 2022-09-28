<?php include __ROOT__ . "/views/header.html"; ?>
<link rel="stylesheet" href="../css/register.css">

<h1>Inscription</h1>
<div id="parent">
  <div id="formulaire-responsive" class="clearfix">
    <form id="form_login" action="/user_add" method="post" autocomplete="on">
      <div class="rang-form">
        <div class="demi-colonne">
          <label>Nom</label><br>
          <input type="text" id="lname" name="lname" placeholder="Dupont" pattern="^[A-Za-z0-9-\s]*$" required><br>
          <br>
        </div>
        <div class="demi-colonne">
          <label>Prénom</label><br>
          <input type="text" id="fnmae" name="fname" placeholder="Pierre" pattern="^[A-Za-z0-9-\s]*$" required><br>
          <br>
        </div>
      </div>
      <div class="rang-form">
        <div class="demi-colonne">
          <label>Date de naissance</label><br>
          <input type="date" id="birthdate" name="birthdate" required><br>
          <br>
        </div>
        <div class="demi-colonne">
          <label>Sexe</label><br>
          <input type="radio" id="male" name="sex" value="M" required>
          <label>Homme</label><br>
          <input type="radio" id="female" name="sex" value="F" required>
          <label>Femme</label><br>
          <br>
        </div>
      </div>
      <div class="rang-form">
        <div class="demi-colonne">
          <label>Taille</label><br>
          <input type="range" id="height" name="height" value="180" min="1" max="250" oninput="this.nextElementSibling.value=this.value" required><output>176</output> cm<br>
          <br>
        </div>
        <div class="demi-colonne">
          <label>Poids</label><br>
          <input type="range" id="weight" name="weight" value="75" min="1" max="150" oninput="this.nextElementSibling.value = this.value" required><output>75</output> kg<br>
          <br>
        </div>
      </div>
      <div class="rang-form">
        <div class="demi-colonne">
          <label>Adresse mail</label><br>
          <input type="mail" id="email" name="email" placeholder="exemple@exemple.com" required><br>
          <br>
        </div>
        <div class="demi-colonne">
          <label>Mot de passe</label><br>
          <input type="password" id="password" name="password" placeholder="Taper le mot de passe" required><br>
          <br>
        </div>
        <input type="submit" name="submit" value="S'inscrire">
    </form>
  </div>
</div>