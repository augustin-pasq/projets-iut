<?php include __ROOT__ . "/views/header.html";
$lname = $data['lname'];
$fname = $data['fname'];
$birthdate = $data['birthdate'];
$sex = $data['sex'];
if($sex=="M") {$homme = "Vrai";}
if($sex=="F") {$homme = "Faux";}
$height = $data['height'];
$weight = $data['weight'];
?>

<link rel="stylesheet" href="../css/register.css">

<div id="parent">
  <div id="formulaire-responsive" class="clearfix">
    <form id="form_login" action="/user_update" method="post" autocomplete="on">
      <h1>Modification des informations du profil</h1>
      <div class="rang-form">
        <div class="demi-colonne">
          <label>Nom</label><br>
          <input type="text" id="lname" name="lname" value=<?php echo $lname;?> pattern="^[A-Za-z0-9-\s]*$" required><br>
          <br>
        </div>
        <div class="demi-colonne">
          <label>Prénom</label><br>
          <input type="text" id="fnmae" name="fname" value=<?php echo $fname;?> pattern="^[A-Za-z0-9-\s]*$" required><br>
          <br>
        </div>
      </div>
      <div class="rang-form">
        <div class="demi-colonne">
          <label>Date de naissance</label><br>
          <input type="date" id="birthdate" value=<?php echo $birthdate;?> name="birthdate" required><br>
          <br>
        </div>
        <div class="demi-colonne">
          <label>Sexe</label><br>
          <input type="radio" id="male" name="sex" <?php if($homme == "Vrai"){ echo "checked";} ?>  value="M" required>
          <label>Homme</label><br>
          <input type="radio" id="female" name="sex"  <?php if($homme == "Faux"){ echo "checked";} ?> value="F" required>
          <label>Femme</label><br>
          <br>
        </div>
      </div>
      <div class="rang-form">
        <div class="demi-colonne">
          <label>Taille</label><br>
          <input type="range" name="heightRange" min="1" max="250" value=<?php echo $height;?> oninput="this.form.height.value=this.value">
          <input type="number" name="height" min="1" max="250" value=<?php echo $height;?> oninput="this.form.heightRange.value=this.value">
          <br>
        </div>
        <div class="demi-colonne">
          <label>Poids</label><br>
          <input type="range" name="weightRange" min="1" max="150" value=<?php echo $weight;?> oninput="this.form.weight.value=this.value">
          <input type="number" name="weight" min="1" max="150" value=<?php echo $weight;?> oninput="this.form.weightRange.value=this.value">
          <br>
        </div>
      </div>
        <input type="submit" name="submit" value="Modifier">
    </form>
  </div>
</div>


