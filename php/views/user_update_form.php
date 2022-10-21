<?php

include __ROOT__ . "/views/header.html";
include __ROOT__."/views/menu.html";

if ($_SESSION["id"] == null) {
  header("location:/");
  exit();
}

$lname = $data['lname'];
$fname = $data['fname'];
$birthdate = $data['birthdate'];
$sex = $data['sex'];
if($sex=="M") {$homme = "Vrai";}
if($sex=="F") {$homme = "Faux";}
$height = $data['height'];
$weight = $data['weight'];

?>

<div class="main-container" id="update-page">
  <form action="/user_update" method="post" autocomplete="on">
    <h1>Mon profil</h1>

    <?php if (isset($data['isUpdated'])) echo "<p class='success-message'>Votre profil a été mis à jour</p>"; ?>

    <div class="column">
      <label>Prénom</label>
      <input type="text" id="fname" name="fname" placeholder="Pierre" value=<?php echo $fname;?> pattern="^[a-zA-Z0-9-\séèçàâêûîôäëüïöÿœÉÈÇÀÂÊÛÎÔÄËÜÏÖùÙ]*$" required>
      <label>Nom</label>
      <input type="text" id="lname" name="lname" placeholder="Dupont" value=<?php echo $lname;?> pattern="^[a-zA-Z0-9-\séèçàâêûîôäëüïöÿœÉÈÇÀÂÊÛÎÔÄËÜÏÖùÙ]*$" required>
      <label>Date de naissance</label>
      <input type="date" id="birthdate" name="birthdate" min="1900-01-01" max="<?php echo date('Y-m-d', strtotime('now')); ?>" value=<?php echo $birthdate;?> required>
    </div>
    
    <div class="column">
      <label>Sexe</label>
      <div class="sex">
        <input type="radio" id="male" name="sex" <?php if($homme == "Vrai"){ echo "checked";} ?>  value="M" required>
        <label for="male">Homme</label>
        <input type="radio" id="female" name="sex"  <?php if($homme == "Faux"){ echo "checked";} ?> value="F" required>
        <label for="female">Femme</label>
      </div>
      <label>Taille</label>
      <input type="range" name="heightRange" min="1" max="250" value=<?php echo $height;?> oninput="this.form.height.value=this.value">
      <input type="number" name="height" min="1" max="250" value=<?php echo $height;?> oninput="this.form.heightRange.value=this.value">cm
      <label>Poids</label>
      <input type="range" name="weightRange" min="1" max="150" value=<?php echo $weight;?> oninput="this.form.weight.value=this.value">
      <input type="number" name="weight" min="1" max="150" value=<?php echo $weight;?> oninput="this.form.weightRange.value=this.value">kg
    </div>

    <div class="column">
      <label>Adresse mail</label>
      <input type="email" id="email" name="email" placeholder=<?php echo $_SESSION["id"];?> pattern="^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$" readonly required>
      <label>Mot de passe</label>
      <input type="password" id="password" name="password" placeholder="••••••••" readonly required>
      <input type="submit" name="submit" value="Modifier">
    </div>
    
  </form>
</div>