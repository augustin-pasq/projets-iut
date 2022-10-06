<?php include __ROOT__ . "/views/header.html"; ?>

<div class="main-container" id="register-page">
  <form id="form_login" action="/user_add" method="post" autocomplete="on">
    
  <h1>Inscription</h1>

    <?php if (isset($data['email'])) echo "<p class='error-message'>Un compte existe déjà pour cette adresse mail</p>"; ?>

    <div class="column">
      <label>Prénom</label>
      <input type="text" id="fname" name="fname" placeholder="Pierre" pattern="^[a-zA-Z0-9-\séèçàâêûîôäëüïöÿœÉÈÇÀÂÊÛÎÔÄËÜÏÖùÙ]*$" required>
      <label>Nom</label>
      <input type="text" id="lname" name="lname" placeholder="Dupont" pattern="^[a-zA-Z0-9-\séèçàâêûîôäëüïöÿœÉÈÇÀÂÊÛÎÔÄËÜÏÖùÙ]*$" required>
      <label>Date de naissance</label>
      <input type="date" id="birthdate" name="birthdate" min="1900-01-01" max="<?php echo date('Y-m-d', strtotime('now')); ?>" required>
    </div>

    <div class="column">
      <label>Sexe</label>
      <div id="sex">
        <input type="radio" id="male" name="sex" value="M" required>
        <label for="male">Homme</label>
        <input type="radio" id="female" name="sex" value="F" required>
        <label for="female">Femme</label>
      </div>
      <label>Taille</label>
      <input type="range" name="heightRange" min="1" max="250" value="180" oninput="this.form.height.value=this.value">
      <input type="number" name="height" min="1" max="250" value="180" oninput="this.form.heightRange.value=this.value">cm
      <label>Poids</label>
      <input type="range" name="weightRange" min="1" max="150" value="75" oninput="this.form.weight.value=this.value">
      <input type="number" name="weight" min="1" max="150" value="75" oninput="this.form.weightRange.value=this.value">kg
    </div>

    <div class="column">
      <label>Adresse mail</label>
      <input type="email" id="email" name="email" placeholder="exemple@exemple.com" pattern="^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$" required>
      <label>Mot de passe</label>
      <input type="password" id="password" name="password" placeholder="Taper le mot de passe" required>
      <input type="submit" name="submit" value="S'inscrire">
      <p>Vous avez déjà un compte ? <a id="link" href="/connect">Se connecter</a></p>
    </div>

  </form>
</div>