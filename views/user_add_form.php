<?php include __ROOT__ . "/views/header.html"; ?>

<div class="main-content">
  <form id="form_login" action="/user_add" method="post" autocomplete="on">
    <h1>Inscription</h1>

    <label>Nom</label><br>
    <input type="text" id="lname" name="lname" placeholder="Dupont" pattern="^[A-Za-z0-9-\s]*$" required><br>
    <br>

    <label>Prénom</label><br>
    <input type="text" id="fnmae" name="fname" placeholder="Pierre" pattern="^[A-Za-z0-9-\s]*$" required><br>
    <br>


    <label>Date de naissance</label><br>
    <input type="date" id="birthdate" name="birthdate" required><br>
    <br>

    <label>Sexe</label><br>
    <input type="radio" id="male" name="sex" value="M" required>
    <label>Homme</label><br>
    <input type="radio" id="female" name="sex" value="F" required>
    <label>Femme</label><br>
    <br>


    <label>Taille</label><br>
    <input type="range" name="heightRange" min="1" max="250" value="180" oninput="this.form.height.value=this.value">
    <input type="number" name="height" min="1" max="250" value="180" oninput="this.form.heightRange.value=this.value">
    <br>

    <label>Poids</label><br>
    <input type="range" name="weightRange" min="1" max="150" value="75" oninput="this.form.weight.value=this.value">
    <input type="number" name="weight" min="1" max="150" value="75" oninput="this.form.weightRange.value=this.value">
    <br>

    <label>Adresse mail</label><br>
    <input type="mail" id="email" name="email" placeholder="exemple@exemple.com" required><br>
    <br>

    <label>Mot de passe</label><br>
    <input type="password" id="password" name="password" placeholder="Taper le mot de passe" required><br>
    <br>
    <input type="submit" name="submit" value="S'inscrire">
  </form>
</div>

<p>Vous avez déjà un compte ? </p><a href="/connect">Se connecter</a><br>