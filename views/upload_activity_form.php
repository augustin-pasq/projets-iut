<?php include __ROOT__."/views/header.html"; ?>

<h1>Importer des données</h1>
  <form action="/upload" method="post">
    <label>Fichier de données</label><br>
    <input type="file" id="file" name="file" accept=".json" required><br><br>
    <input type="submit" value="Importer">
  </form>

  <br>
  <a href="./updateProfile.html">Modifier mon profil</a>

<?php if($data != null) echo $data["message"]; ?>